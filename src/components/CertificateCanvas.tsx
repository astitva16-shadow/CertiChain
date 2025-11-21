/**
 * Certificate rendering component using HTML/CSS for high-quality output
 * Designed for export to PNG and PDF
 */

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import type { CertificatePayload } from '@/lib/types';
import { getVerificationURL } from '@/lib/cert-utils';

interface CertificateCanvasProps {
  payload: CertificatePayload;
  signature?: string;
  onReady?: () => void;
}

export function CertificateCanvas({ payload, signature, onReady }: CertificateCanvasProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate QR code with verification URL
    const verificationUrl = getVerificationURL(payload.cert_uuid);
    
    QRCode.toDataURL(verificationUrl, {
      width: 200,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#1e293b',
        light: '#ffffff'
      }
    })
      .then(url => {
        setQrCodeDataUrl(url);
        // Notify parent that certificate is ready
        setTimeout(() => onReady?.(), 100);
      })
      .catch(err => console.error('QR code generation error:', err));
  }, [payload, onReady]);

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div
      ref={containerRef}
      className="certificate-canvas relative w-[800px] h-[600px] bg-white text-slate-800 overflow-hidden"
      style={{
        fontFamily: 'Georgia, serif',
        border: '12px solid #2563eb',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}
    >
      {/* Inner border decoration */}
      <div className="absolute inset-4 border-2 border-slate-300" />
      
      {/* Content container */}
      <div className="relative flex flex-col items-center justify-between h-full p-12">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-block px-4 py-1 bg-primary/10 rounded-full">
            <p className="text-sm font-semibold text-primary tracking-wider uppercase">
              Certificate of Completion
            </p>
          </div>
          <h1 className="text-5xl font-bold text-slate-900 tracking-tight">
            CertiChain
          </h1>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-8 max-w-2xl">
          <p className="text-lg text-slate-600 text-center">
            This is to certify that
          </p>
          
          <h2 className="text-4xl font-bold text-slate-900 text-center border-b-2 border-slate-300 pb-2 px-8">
            {payload.recipient_name}
          </h2>
          
          <p className="text-lg text-slate-600 text-center">
            has successfully completed
          </p>
          
          <h3 className="text-2xl font-semibold text-primary text-center">
            {payload.course_name}
          </h3>
        </div>

        {/* Footer with issuer and date */}
        <div className="w-full flex items-end justify-between">
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="w-48 border-t-2 border-slate-900" />
              <p className="text-sm font-semibold text-slate-900">{payload.issuer_name}</p>
              <p className="text-xs text-slate-600">Authorized Issuer</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-slate-600">Issue Date</p>
              <p className="text-sm font-semibold text-slate-900">{formatDate(payload.issue_date)}</p>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center gap-2">
            {qrCodeDataUrl && (
              <img
                src={qrCodeDataUrl}
                alt="Verification QR Code"
                className="w-28 h-28 border-2 border-slate-200 rounded"
              />
            )}
            <p className="text-xs text-slate-500 text-center max-w-[120px]">
              Scan to verify authenticity
            </p>
          </div>
        </div>

        {/* Certificate ID watermark */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <p className="text-xs text-slate-400 font-mono tracking-wider">
            ID: {payload.cert_uuid.slice(0, 8)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CertificateCanvas;
