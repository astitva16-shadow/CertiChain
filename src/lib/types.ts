/**
 * Core TypeScript types for CertiChain application
 */

export interface CertificateRecord {
  _uid: string; // Devv user ID
  _id: string; // Auto-generated unique ID
  cert_uuid: string; // Certificate UUID v4
  recipient_name: string;
  course_name: string;
  issuer_name: string;
  issue_date: string; // ISO 8601
  signature: string; // Base64 RSA-PSS signature
  status: 'active' | 'revoked';
  created_at: string; // ISO 8601
  created_by: string; // User ID
  revoked_at?: string; // ISO 8601
  revoked_by?: string; // User ID
  audit_log: string; // JSON array of AuditEvent[]
  notes?: string;
  role?: string; // issuer, verifier, admin
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
  publicKeyFingerprint?: string;
}

export interface User {
  projectId: string;
  uid: string;
  name: string;
  email: string;
  createdTime: number;
  lastLoginTime: number;
  role?: 'issuer' | 'verifier' | 'admin';
}

export interface SignatureKeyPair {
  publicKey: string; // PEM format
  privateKey?: string; // PEM format (client-side only, never stored)
  algorithm: 'RSA-PSS' | 'ECDSA';
  fingerprint: string;
}
