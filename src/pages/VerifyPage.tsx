/**
 * Certificate verification page with signature validation
 */

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { CertificateCanvas } from '@/components/CertificateCanvas';
import {
  CheckCircle2,
  XCircle,
  Shield,
  Calendar,
  User,
  Building,
  FileText,
  Loader2,
  AlertTriangle,
  Search
} from 'lucide-react';
import { getCertificateByUuid } from '@/lib/certificates';
import { createCanonicalPayload, verifySignature, importPublicKey } from '@/lib/cert-utils';
import type { CertificateRecord, VerificationResult, AuditEvent } from '@/lib/types';

export function VerifyPage() {
  const { certUuid } = useParams<{ certUuid: string }>();
  const [searchUuid, setSearchUuid] = useState('');
  const [certificate, setCertificate] = useState<CertificateRecord | null>(null);
  const [verification, setVerification] = useState<VerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (certUuid) {
      verifyCertificate(certUuid);
    }
  }, [certUuid]);

  const verifyCertificate = async (uuid: string) => {
    setIsLoading(true);
    setError(null);
    setCertificate(null);
    setVerification(null);

    try {
      // Fetch certificate from database
      const { data: cert, error } = await getCertificateByUuid(uuid);

      if (error || !cert) {
        setError('Certificate not found');
        setVerification({
          verified: false,
          reason: 'Certificate with this UUID does not exist in the database'
        });
        return;
      }

      setCertificate(cert);

      // Check if revoked
      if (cert.status === 'revoked') {
        setVerification({
          verified: false,
          reason: 'Certificate has been revoked by the issuer.',
          certificate: cert
        });
        return;
      }

      // Reconstruct canonical payload
      const payload = createCanonicalPayload({
        cert_uuid: cert.certificate_id,
        recipient_name: cert.recipient_name,
        course_name: cert.course_name,
        issuer_name: cert.issuer_name,
        issue_date: cert.issued_at
      });

      const publicKeyPem = cert.public_key;
      if (!publicKeyPem) {
        setVerification({
          verified: false,
          reason: 'Public key missing. Certificate cannot be verified.',
          certificate: cert
        });
        return;
      }

      // Import public key
      const publicKey = await importPublicKey(publicKeyPem);

      // Verify signature
      const isValid = await verifySignature(payload, cert.signature, publicKey);

      if (isValid) {
        setVerification({
          verified: true,
          reason: 'Signature verified successfully. Certificate is authentic.',
          certificate: cert,
          publicKeyFingerprint: cert.fingerprint
        });
      } else {
        setVerification({
          verified: false,
          reason: 'Signature verification failed. Certificate may have been tampered with.',
          certificate: cert
        });
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError('Failed to verify certificate. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchUuid.trim()) {
      window.location.href = `/verify/${searchUuid.trim()}`;
    }
  };

  const formatDate = (isoDate: string) => {
    return new Date(isoDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAuditLog = (): AuditEvent[] => {
    if (!certificate?.metadata || typeof certificate.metadata !== 'object') {
      return [];
    }
    const raw = (certificate.metadata as Record<string, unknown>)?.audit;
    if (!Array.isArray(raw)) return [];
    return raw as AuditEvent[];
  };

  // Search form (no UUID in URL)
  if (!certUuid) {
    return (
      <div className="container max-w-2xl py-12">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Verify Certificate</CardTitle>
            <CardDescription>
              Enter a certificate UUID to verify its authenticity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="uuid">Certificate UUID</Label>
                <Input
                  id="uuid"
                  placeholder="e.g., 550e8400-e29b-41d4-a716-446655440000"
                  value={searchUuid}
                  onChange={(e) => setSearchUuid(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                <Search className="w-4 h-4 mr-2" />
                Verify Certificate
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="container max-w-4xl py-12">
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center gap-4 text-center">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <p className="text-lg font-medium">Verifying certificate...</p>
              <p className="text-sm text-muted-foreground">
                Checking signature and authenticity
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error || (verification && !certificate)) {
    return (
      <div className="container max-w-4xl py-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="w-5 h-5" />
              Verification Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                {error || verification?.reason}
              </AlertDescription>
            </Alert>
            <div className="mt-4 flex gap-2">
              <Button asChild variant="outline">
                <Link to="/verify">Try Another Certificate</Link>
              </Button>
              <Button asChild>
                <Link to="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state with certificate details
  return (
    <div className="container max-w-6xl py-8 space-y-6">
      {/* Verification Status */}
      <Card className={verification?.verified ? 'border-success' : 'border-destructive'}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {verification?.verified ? (
              <>
                <CheckCircle2 className="w-6 h-6 text-success" />
                <span className="text-success">Certificate Verified</span>
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6 text-destructive" />
                <span className="text-destructive">
                  {certificate?.status === 'revoked' ? 'Certificate Revoked' : 'Verification Failed'}
                </span>
              </>
            )}
          </CardTitle>
          <CardDescription>{verification?.reason}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Certificate UUID</p>
              <p className="font-mono text-sm">{certificate?.certificate_id}</p>
            </div>
            <Badge variant={verification?.verified ? 'default' : 'destructive'} className="text-sm">
              {certificate?.status === 'revoked' ? 'REVOKED' : verification?.verified ? 'VALID' : 'INVALID'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Certificate Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Certificate Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <div className="scale-75 origin-top">
                {certificate && (
                  <CertificateCanvas
                    payload={createCanonicalPayload({
                      cert_uuid: certificate.certificate_id,
                      recipient_name: certificate.recipient_name,
                      course_name: certificate.course_name,
                      issuer_name: certificate.issuer_name,
                      issue_date: certificate.issued_at
                    })}
                    signature={certificate.signature}
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Certificate Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Certificate Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Recipient</p>
                    <p className="font-semibold">{certificate?.recipient_name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Course</p>
                    <p className="font-semibold">{certificate?.course_name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Issued By</p>
                    <p className="font-semibold">{certificate?.issuer_name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Issue Date</p>
                    <p className="font-semibold">
                      {certificate?.issued_at && formatDate(certificate.issued_at)}
                    </p>
                  </div>
                </div>
              </div>

              {certificate?.notes && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Notes</p>
                    <p className="text-sm">{certificate.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Cryptographic Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Cryptographic Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Signature Algorithm</p>
                <p className="text-sm font-mono">RSA-PSS with SHA-256</p>
              </div>

              {verification?.publicKeyFingerprint && (
                <div>
                  <p className="text-sm text-muted-foreground">Public Key Fingerprint</p>
                  <p className="text-xs font-mono break-all bg-muted p-2 rounded">
                    {verification.publicKeyFingerprint}
                  </p>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground">Digital Signature</p>
                <details className="text-xs font-mono break-all bg-muted p-2 rounded cursor-pointer">
                  <summary className="cursor-pointer">Click to expand</summary>
                  <p className="mt-2">{certificate?.signature}</p>
                </details>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="text-sm">
                  {certificate?.created_at && formatDate(certificate.created_at)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Audit Log */}
          {getAuditLog().length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Audit Trail</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getAuditLog().map((event, index) => (
                    <div key={index} className="flex gap-3 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      <div className="flex-1">
                        <p className="font-medium capitalize">{event.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(event.timestamp)}
                          {event.reason && ` • ${event.reason}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 justify-center">
        <Button asChild variant="outline">
          <Link to="/verify">Verify Another</Link>
        </Button>
        <Button asChild>
          <Link to="/dashboard">View Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}

export default VerifyPage;
