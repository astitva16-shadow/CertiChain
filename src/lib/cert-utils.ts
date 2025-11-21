/**
 * Certificate utility functions for signature generation, verification,
 * and canonical payload creation
 */

import type { CertificatePayload } from './types';

/**
 * Create canonical payload from certificate data
 * CRITICAL: Keys must be in alphabetical order for deterministic signing
 */
export function createCanonicalPayload(data: {
  cert_uuid: string;
  recipient_name: string;
  course_name: string;
  issuer_name: string;
  issue_date: string;
}): CertificatePayload {
  return {
    cert_uuid: data.cert_uuid,
    course_name: data.course_name.trim(),
    issuer_name: data.issuer_name.trim(),
    issue_date: data.issue_date,
    recipient_name: data.recipient_name.trim()
  };
}

/**
 * Convert canonical payload to deterministic bytes for signing
 * Uses sorted keys and no whitespace
 */
export function payloadToBytes(payload: CertificatePayload): Uint8Array {
  const sortedKeys = Object.keys(payload).sort();
  const sortedPayload: any = {};
  sortedKeys.forEach(key => {
    sortedPayload[key] = payload[key as keyof CertificatePayload];
  });
  
  const jsonString = JSON.stringify(sortedPayload, sortedKeys);
  return new TextEncoder().encode(jsonString);
}

/**
 * Generate RSA-PSS key pair in browser (SubtleCrypto)
 * WARNING: This is for client-side signing only and is INSECURE for production
 */
export async function generateKeyPair(): Promise<CryptoKeyPair> {
  return await window.crypto.subtle.generateKey(
    {
      name: 'RSA-PSS',
      modulusLength: 3072,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256'
    },
    true, // extractable
    ['sign', 'verify']
  );
}

/**
 * Sign payload with private key (client-side)
 * WARNING: INSECURE - private key exposed in browser
 */
export async function signPayload(
  payload: CertificatePayload,
  privateKey: CryptoKey
): Promise<string> {
  const payloadBytes = payloadToBytes(payload);
  
  const signature = await window.crypto.subtle.sign(
    {
      name: 'RSA-PSS',
      saltLength: 32
    },
    privateKey,
    payloadBytes
  );

  // Convert to base64
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

/**
 * Verify signature with public key
 */
export async function verifySignature(
  payload: CertificatePayload,
  signatureBase64: string,
  publicKey: CryptoKey
): Promise<boolean> {
  try {
    const payloadBytes = payloadToBytes(payload);
    
    // Decode base64 signature
    const signatureBytes = Uint8Array.from(atob(signatureBase64), c => c.charCodeAt(0));

    const valid = await window.crypto.subtle.verify(
      {
        name: 'RSA-PSS',
        saltLength: 32
      },
      publicKey,
      signatureBytes,
      payloadBytes
    );

    return valid;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

/**
 * Export public key to PEM format
 */
export async function exportPublicKey(publicKey: CryptoKey): Promise<string> {
  const exported = await window.crypto.subtle.exportKey('spki', publicKey);
  const exportedAsBase64 = btoa(String.fromCharCode(...new Uint8Array(exported)));
  const pem = `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64.match(/.{1,64}/g)?.join('\n')}\n-----END PUBLIC KEY-----`;
  return pem;
}

/**
 * Import public key from PEM format
 */
export async function importPublicKey(pem: string): Promise<CryptoKey> {
  const pemContents = pem
    .replace('-----BEGIN PUBLIC KEY-----', '')
    .replace('-----END PUBLIC KEY-----', '')
    .replace(/\s/g, '');
  
  const binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));

  return await window.crypto.subtle.importKey(
    'spki',
    binaryDer,
    {
      name: 'RSA-PSS',
      hash: 'SHA-256'
    },
    true,
    ['verify']
  );
}

/**
 * Generate fingerprint from public key (SHA-256 hash)
 */
export async function generateFingerprint(publicKey: CryptoKey): Promise<string> {
  const exported = await window.crypto.subtle.exportKey('spki', publicKey);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', exported);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  // Format as fingerprint (XX:XX:XX:...)
  return hashHex.match(/.{1,2}/g)?.join(':').toUpperCase() || hashHex;
}

/**
 * Download blob as file
 */
export function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Format date to ISO string (YYYY-MM-DD)
 */
export function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Generate verification URL for certificate
 */
export function getVerificationURL(certUuid: string): string {
  return `${window.location.origin}/verify/${certUuid}`;
}
