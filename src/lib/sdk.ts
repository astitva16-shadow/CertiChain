/**
 * Devv SDK wrapper for authentication and table operations
 */

import { auth, table } from '@devvai/devv-code-backend';
import type { CertificateRecord, User } from './types';

const TABLE_ID = 'f3opvib0vpq8'; // certificates table

/**
 * Authentication wrapper
 */
export const authService = {
  /**
   * Send OTP to email
   */
  async sendOTP(email: string): Promise<void> {
    await auth.sendOTP(email);
  },

  /**
   * Verify OTP and login
   */
  async verifyOTP(email: string, code: string): Promise<User> {
    const response = await auth.verifyOTP(email, code);
    return response.user as User;
  },

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    await auth.logout();
  },

  /**
   * Get current user ID from session
   */
  getCurrentUserId(): string | null {
    const sid = localStorage.getItem('DEVV_CODE_SID');
    if (!sid) return null;
    
    // Try to get user from stored auth response
    const userStr = localStorage.getItem('DEVV_USER');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.uid;
      } catch {
        return null;
      }
    }
    return null;
  },

  /**
   * Get current user details
   */
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('DEVV_USER');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  },

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('DEVV_CODE_SID');
  },

  /**
   * Store user info after login
   */
  storeUser(user: User): void {
    localStorage.setItem('DEVV_USER', JSON.stringify(user));
  }
};

/**
 * Certificate table operations
 */
export const certificateService = {
  /**
   * Create a new certificate record
   */
  async createCertificate(cert: Omit<CertificateRecord, '_id'>): Promise<void> {
    await table.addItem(TABLE_ID, cert);
  },

  /**
   * Get certificate by UUID
   */
  async getCertificateByUUID(cert_uuid: string): Promise<CertificateRecord | null> {
    try {
      const response = await table.getItems(TABLE_ID, {
        query: {
          cert_uuid: cert_uuid
        },
        limit: 1
      });

      if (response.items && response.items.length > 0) {
        return response.items[0] as CertificateRecord;
      }
      return null;
    } catch (error) {
      console.error('Error fetching certificate:', error);
      return null;
    }
  },

  /**
   * Get all certificates for current user
   */
  async getUserCertificates(userId: string, status?: 'active' | 'revoked'): Promise<CertificateRecord[]> {
    try {
      const query: any = {
        _uid: userId
      };

      if (status) {
        query.status = status;
      }

      const response = await table.getItems(TABLE_ID, {
        query,
        limit: 100,
        sort: '_id',
        order: 'desc'
      });

      return (response.items || []) as CertificateRecord[];
    } catch (error) {
      console.error('Error fetching user certificates:', error);
      return [];
    }
  },

  /**
   * Update certificate (for revocation)
   */
  async updateCertificate(cert: Partial<CertificateRecord> & { _uid: string; _id: string }): Promise<void> {
    await table.updateItem(TABLE_ID, cert);
  },

  /**
   * Revoke a certificate
   */
  async revokeCertificate(
    cert: CertificateRecord,
    revokedBy: string,
    reason?: string
  ): Promise<void> {
    const auditLog = JSON.parse(cert.audit_log || '[]');
    auditLog.push({
      action: 'revoked',
      timestamp: new Date().toISOString(),
      userId: revokedBy,
      reason: reason || 'No reason provided'
    });

    await this.updateCertificate({
      _uid: cert._uid,
      _id: cert._id,
      status: 'revoked',
      revoked_at: new Date().toISOString(),
      revoked_by: revokedBy,
      audit_log: JSON.stringify(auditLog)
    });
  },

  /**
   * Get all certificates (public verification - no auth required)
   */
  async getAllCertificates(limit = 20): Promise<CertificateRecord[]> {
    try {
      const response = await table.getItems(TABLE_ID, {
        limit,
        sort: '_id',
        order: 'desc'
      });

      return (response.items || []) as CertificateRecord[];
    } catch (error) {
      console.error('Error fetching all certificates:', error);
      return [];
    }
  }
};

export { TABLE_ID };
