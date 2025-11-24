/**
 * Certificate issuance page with form and client-side signing
 */

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { CertificateCanvas } from '@/components/CertificateCanvas';
import { AuthDialog } from '@/components/AuthDialog';
import {
  createCanonicalPayload,
  generateKeyPair,
  signPayload,
  exportPublicKey,
  generateFingerprint,
  downloadFile,
  formatDateISO
} from '@/lib/cert-utils';
import { issueCertificate } from '@/lib/certificates';
import { Loader2, FileCheck, AlertTriangle, Shield, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as htmlToImage from 'html-to-image';
import jsPDF from 'jspdf';

export function IssuePage() {
  const navigate = useNavigate();
  const { user, profile, session, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    recipient_name: '',
    course_name: '',
    issuer_name: profile?.full_name || user?.email || '',
    issue_date: formatDateISO(new Date()),
    notes: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [acceptedWarning, setAcceptedWarning] = useState(false);
  const [certUuid, setCertUuid] = useState<string | null>(null);
  const [certPayload, setCertPayload] = useState<any>(null);
  const [certSignature, setCertSignature] = useState<string | null>(null);
  const [isGeneratingFiles, setIsGeneratingFiles] = useState(false);
  const [certificateReady, setCertificateReady] = useState(false);
  
  const certRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      setShowAuthDialog(true);
      return;
    }
    if (!session?.access_token) {
      toast({
        title: 'Session expired',
        description: 'Please sign in again to issue certificates.',
        variant: 'destructive',
      });
      setShowAuthDialog(true);
      return;
    }

    if (!acceptedWarning) {
      toast({
        title: 'Security warning',
        description: 'Please read and accept the security warning before proceeding.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Generate certificate UUID
      const cert_uuid = uuidv4();
      setCertUuid(cert_uuid);

      // Step 2: Create canonical payload
      const payload = createCanonicalPayload({
        cert_uuid,
        recipient_name: formData.recipient_name,
        course_name: formData.course_name,
        issuer_name: formData.issuer_name,
        issue_date: formData.issue_date
      });
      setCertPayload(payload);

      // Step 3: Generate key pair and sign (CLIENT-SIDE - INSECURE)
      toast({
        title: 'Generating cryptographic keys...',
        description: 'This may take a moment'
      });

      const keyPair = await generateKeyPair();
      const signature = await signPayload(payload, keyPair.privateKey);
      setCertSignature(signature);

      // Export and store public key for verification
      const publicKeyPem = await exportPublicKey(keyPair.publicKey);
      const fingerprint = await generateFingerprint(keyPair.publicKey);

      // Step 4: Persist via server-side API
      await issueCertificate(
        {
          certificate_id: cert_uuid,
          recipient_name: formData.recipient_name,
          course_name: formData.course_name,
          issuer_name: formData.issuer_name,
          issued_at: formData.issue_date,
          notes: formData.notes || '',
          metadata: {
            audit: [
              {
                action: 'created',
                timestamp: new Date().toISOString(),
                userId: user.id,
                userAgent: navigator.userAgent,
              },
            ],
          },
          signature,
          public_key: publicKeyPem,
          fingerprint,
        },
        session.access_token
      );

      toast({
        title: 'Certificate created!',
        description: 'Generating PDF and PNG files...'
      });

      // Certificate canvas will render, wait for it
      setCertificateReady(false);
      
    } catch (error) {
      console.error('Issuance error:', error);
      toast({
        title: 'Error',
        description: 'Failed to issue certificate. Please try again.',
        variant: 'destructive'
      });
      setIsSubmitting(false);
    }
  };

  const handleCertificateReady = async () => {
    setCertificateReady(true);
    
    // Auto-generate files after a short delay
    setTimeout(() => {
      generateFiles();
    }, 500);
  };

  const generateFiles = async () => {
    if (!certRef.current || !certUuid) return;

    setIsGeneratingFiles(true);

    try {
      // Generate PNG
      const pngDataUrl = await htmlToImage.toPng(certRef.current, {
        quality: 1.0,
        pixelRatio: 3,
        backgroundColor: '#ffffff'
      });

      // Convert to blob and download
      const pngBlob = await (await fetch(pngDataUrl)).blob();
      downloadFile(pngBlob, `certificate_${certUuid}.png`);

      // Generate PDF
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [800, 600]
      });

      pdf.addImage(pngDataUrl, 'PNG', 0, 0, 800, 600, undefined, 'FAST');
      pdf.save(`certificate_${certUuid}.pdf`);

      toast({
        title: 'Files generated!',
        description: 'Certificate PNG and PDF downloaded successfully.'
      });

      // Navigate to certificate view
      setTimeout(() => {
        navigate(`/verify/${certUuid}`);
      }, 1000);
      
    } catch (error) {
      console.error('File generation error:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate files. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsGeneratingFiles(false);
      setIsSubmitting(false);
    }
  };

  if (certPayload && certUuid) {
    return (
      <div className="container max-w-6xl py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-success" />
              Certificate Generated
            </CardTitle>
            <CardDescription>
              Your certificate is being prepared for download
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Certificate preview (hidden but rendered for export) */}
            <div className="flex justify-center" ref={certRef}>
              <CertificateCanvas
                payload={certPayload}
                signature={certSignature || undefined}
                onReady={handleCertificateReady}
              />
            </div>

            {isGeneratingFiles && (
              <Alert>
                <Loader2 className="w-4 h-4 animate-spin" />
                <AlertDescription>
                  Generating high-resolution PNG and PDF files...
                </AlertDescription>
              </Alert>
            )}

            {certificateReady && !isGeneratingFiles && (
              <div className="flex gap-3 justify-center">
                <Button onClick={generateFiles} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Re-download Files
                </Button>
                <Button onClick={() => navigate(`/verify/${certUuid}`)}>
                  View Certificate
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="w-5 h-5" />
            Issue Certificate
          </CardTitle>
          <CardDescription>
            Create a digitally signed certificate with blockchain-like verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Security Warning */}
            <Alert variant="destructive">
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription className="space-y-2">
                <p className="font-semibold">⚠️ CLIENT-SIDE SIGNING WARNING</p>
                <p className="text-sm">
                  This application uses <strong>browser-based signing</strong> which is{' '}
                  <strong>INSECURE for production use</strong>. Private keys are generated in your browser
                  and never stored permanently, but this method exposes keys to potential browser vulnerabilities.
                </p>
                <p className="text-sm">
                  <strong>Production recommendation:</strong> Use server-side signing with Hardware Security Modules (HSM)
                  or Key Management Systems (KMS) to keep private keys secure.
                </p>
                <div className="flex items-center space-x-2 mt-3">
                  <Checkbox
                    id="accept-warning"
                    checked={acceptedWarning}
                    onCheckedChange={(checked) => setAcceptedWarning(checked as boolean)}
                  />
                  <label
                    htmlFor="accept-warning"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I understand the security risks and accept them for this demo
                  </label>
                </div>
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipient_name">Recipient Name *</Label>
                <Input
                  id="recipient_name"
                  placeholder="John Smith"
                  value={formData.recipient_name}
                  onChange={(e) => handleInputChange('recipient_name', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="course_name">Course Name *</Label>
                <Input
                  id="course_name"
                  placeholder="Advanced Web Development"
                  value={formData.course_name}
                  onChange={(e) => handleInputChange('course_name', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issuer_name">Issuer Name *</Label>
                <Input
                  id="issuer_name"
                  placeholder="Tech Academy"
                  value={formData.issuer_name}
                  onChange={(e) => handleInputChange('issuer_name', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issue_date">Issue Date *</Label>
                <Input
                  id="issue_date"
                  type="date"
                  value={formData.issue_date}
                  onChange={(e) => handleInputChange('issue_date', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            {!isAuthenticated && (
              <Alert>
                <Shield className="w-4 h-4" />
                <AlertDescription>
                  You must be signed in to issue certificates.{' '}
                  <button
                    type="button"
                    onClick={() => setShowAuthDialog(true)}
                    className="font-semibold underline"
                  >
                    Sign in now
                  </button>
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !isAuthenticated || !acceptedWarning}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Issuing Certificate...
                </>
              ) : (
                <>
                  <FileCheck className="w-4 h-4 mr-2" />
                  Issue Certificate
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onSuccess={() =>
          setFormData(prev => ({
            ...prev,
            issuer_name: profile?.full_name || user?.email || '',
          }))
        }
      />
    </div>
  );
}

export default IssuePage;
