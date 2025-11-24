/**
 * Core TypeScript types for CertiChain application
 */

export interface CertificateRecord {
  id: string;
  certificate_id: string;
  user_id: string;
  recipient_name: string;
  course_name: string;
  issued_at: string;
  issuer_name: string;
  signature: string;
  public_key: string;
  fingerprint?: string | null;
  status: 'active' | 'revoked';
  created_at: string;
  updated_at?: string | null;
  notes?: string | null;
  metadata?: Record<string, unknown> | null;
  signature_url?: string | null;
}

export interface AuditEvent {
  action: 'created' | 'revoked' | 'verified' | 'viewed';
  timestamp: string; // ISO 8601
  userId: string;
  userName?: string;
  reason?: string;
  ip?: string;
  userAgent?: string;
}

export interface CertificatePayload {
  cert_uuid: string;
  recipient_name: string;
  course_name: string;
  issuer_name: string;
  issue_date: string; // ISO 8601
}

export interface IssuanceFormData {
  recipient_name: string;
  course_name: string;
  issuer_name: string;
  issue_date: string;
  notes?: string;
}

export interface VerificationResult {
  verified: boolean;
  reason: string;
  certificate?: CertificateRecord;
  publicKeyFingerprint?: string | null;
}

export interface Profile {
  id: string;
  email: string;
  full_name?: string | null;
  avatar_url?: string | null;
  organization?: string | null;
}

export interface SignatureKeyPair {
  publicKey: string; // PEM format
  privateKey?: string; // PEM format (client-side only, never stored)
  algorithm: 'RSA-PSS' | 'ECDSA';
  fingerprint: string;
}
