import { supabase } from './supabase';
import type { CertificateRecord } from './types';

export interface IssueCertificateRequest {
  certificate_id: string;
  recipient_name: string;
  course_name: string;
  issuer_name: string;
  issued_at: string;
  notes?: string;
  metadata?: Record<string, unknown>;
  signature: string;
  public_key: string;
  fingerprint: string;
}

const API_PATH = '/api/issue-certificate';

export async function issueCertificate(
  payload: IssueCertificateRequest,
  accessToken?: string
): Promise<CertificateRecord> {
  if (!accessToken) {
    throw new Error('Missing Supabase access token. Please sign in again.');
  }

  const response = await fetch(API_PATH, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Failed to issue certificate.');
  }

  const data = (await response.json()) as { certificate: CertificateRecord };
  return data.certificate;
}

export async function getCertificatesForUser(userId: string) {
  return supabase
    .from('certificates')
    .select('*')
    .eq('user_id', userId)
    .order('issued_at', { ascending: false });
}

export async function getCertificateByUuid(certificateId: string) {
  return supabase
    .from('certificates')
    .select('*')
    .eq('certificate_id', certificateId)
    .single();
}

export async function revokeCertificate(certificateId: string) {
  return supabase
    .from('certificates')
    .update({ status: 'revoked', updated_at: new Date().toISOString() })
    .eq('certificate_id', certificateId)
    .select()
    .single();
}

