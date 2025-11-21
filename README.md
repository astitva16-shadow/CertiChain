# 🎓 CertiChain - Digital Certificate Management System

A modern, production-ready certificate issuance and verification platform with **Supabase backend**, **dark/light theme support**, and **beautiful animations**. Built with React, TypeScript, Framer Motion, and cryptographic digital signatures.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.x-61dafb.svg)
![Supabase](https://img.shields.io/badge/Supabase-Enabled-3ecf8e.svg)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env and add your Supabase credentials

# Start development server
npm run dev

# Build for production
npm run build
```

Visit `http://localhost:5173` to access the application.

## ✨ New Features (v2.0)

### 🎨 Modern UI/UX
- **Dark/Light Theme** - System-aware theme switching with smooth transitions
- **Framer Motion Animations** - Buttery-smooth animations throughout the app
- **Animated Components** - Interactive buttons, cards, and page transitions
- **Glass Morphism Effects** - Modern, trendy UI design
- **Gradient Backgrounds** - Beautiful animated gradients

### 🔐 Supabase Backend Integration
- **PostgreSQL Database** - Scalable, reliable data storage
- **Row Level Security** - Built-in security policies
- **Authentication** - Email/password auth with Supabase Auth
- **Real-time Sync** - Live updates across clients
- **File Storage** - Certificate image storage

### 📦 Deployment Ready
- **Vercel Configuration** - One-click deployment to Vercel
- **Environment Management** - Secure environment variable handling
- **Production Optimized** - Build configuration for performance

## ✨ Core Features

### Certificate Issuance
- **Digital Signatures**: RSA-PSS signatures (3072-bit keys) with SHA-256
- **Instant Export**: High-resolution PDF and PNG generation in browser
- **QR Code Integration**: Embedded QR codes for quick verification
- **Professional Design**: Print-ready certificate layout optimized for A4/Letter
- **Supabase Storage**: Certificates stored securely in the cloud

### Verification System
- **Public Verification**: No authentication required to verify certificates
- **Cryptographic Validation**: Signature verification using public key cryptography
- **Revocation Checking**: Automatic status validation
- **Audit Trail Display**: Complete history of certificate lifecycle

### Certificate Management
- **Issuer Dashboard**: View and manage all issued certificates
- **Search & Filter**: Find certificates by recipient, course, or UUID
- **Revocation Support**: Revoke certificates with audit logging
- **Statistics**: Track active and revoked certificates
- **Real-time Updates**: Live data synchronization

### Security Features
- **Supabase Authentication**: Secure email/password authentication
- **Row Level Security**: Database-level access control
- **Client-Side Signing**: Browser-based key generation
- **Public Key Storage**: Verification keys stored for transparency
- **Immutable Audit Logs**: Complete event tracking

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier available at [supabase.com](https://supabase.com))
- Vercel account (for deployment)
- Modern browser with Web Crypto API support

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Authentication**: Devv SDK (Email OTP)
- **Database**: Devv SDK Table API (NoSQL)
- **Cryptography**: Web Crypto API (RSA-PSS)
- **Export**: html-to-image + jsPDF
- **QR Codes**: qrcode library

### Project Structure

```
certichain-frontend/
├── src/
│   ├── components/
│   │   ├── ui/                 # shadcn/ui primitives
│   │   ├── AuthDialog.tsx      # Email OTP authentication
│   │   ├── Header.tsx          # App header with nav
│   │   └── CertificateCanvas.tsx # Certificate renderer
│   ├── pages/
│   │   ├── HomePage.tsx        # Landing page
│   │   ├── IssuePage.tsx       # Certificate issuance form
│   │   ├── VerifyPage.tsx      # Verification page
│   │   └── DashboardPage.tsx   # Certificate management
│   ├── lib/
│   │   ├── sdk.ts              # Devv SDK wrapper
│   │   ├── cert-utils.ts       # Crypto utilities
│   │   └── types.ts            # TypeScript types
│   ├── hooks/
│   │   └── useAuth.ts          # Authentication hook
│   ├── App.tsx                 # Root component with routing
│   └── index.css               # Design system & styles
├── package.json
├── vite.config.ts
└── README.md
```

## 🔐 Security

### ⚠️ Important: Client-Side Signing Warning

This application uses **browser-based cryptographic signing** for demonstration purposes. This approach has significant security limitations:

**Current Implementation (Demo Mode)**
- Private keys generated in browser memory
- Keys not persisted between sessions
- Vulnerable to browser-based attacks
- Suitable for demos and testing only

**Production Recommendations**

For production deployments, implement **server-side signing**:

1. **Hardware Security Modules (HSM)**
   - Store private keys in tamper-resistant hardware
   - AWS CloudHSM, Azure Key Vault, or Google Cloud HSM

2. **Key Management Systems (KMS)**
   - Centralized key lifecycle management
   - Automatic key rotation and auditing
   - AWS KMS, Azure Key Vault, HashiCorp Vault

3. **Air-Gapped Signing Service**
   - Isolated signing server with no internet access
   - Private keys never leave secure environment
   - API gateway for signature requests

4. **Certificate Transparency**
   - Publish public keys at known URLs (e.g., `https://yourorg.com/keys/issuer_public.pem`)
   - Enable independent verification by third parties
   - Implement key rotation with version tracking

### Security Best Practices

```typescript
// Production signing workflow:
// 1. Client sends canonical payload to server
// 2. Server signs with HSM-stored private key
// 3. Server returns signature
// 4. Client stores certificate + signature in database
// 5. Public key published for verification
```

### Data Security
- **Public Read**: Certificate verification requires no authentication
- **Authorized Write**: Only authenticated users can issue certificates
- **Audit Logging**: All actions tracked with timestamp and user ID
- **No PII Exposure**: Private keys never stored or transmitted

## 📚 Usage Guide

### Issuing a Certificate

1. **Sign In**: Click "Sign in" and authenticate via email OTP
2. **Navigate**: Go to "Issue Certificate" page
3. **Fill Form**: 
   - Recipient name
   - Course name
   - Issuer name (auto-filled from profile)
   - Issue date
   - Optional notes
4. **Accept Warning**: Read and accept client-side signing warning
5. **Submit**: Click "Issue Certificate"
6. **Download**: PNG and PDF automatically downloaded
7. **View**: Certificate opens in verification page

### Verifying a Certificate

1. **Visit**: Navigate to "Verify" page or scan QR code
2. **Enter UUID**: Paste certificate UUID or use QR scanner
3. **View Results**:
   - ✅ Green badge: Signature verified, certificate active
   - ❌ Red badge: Invalid signature or certificate revoked
4. **Details**: View recipient, course, issuer, dates, and audit log

### Managing Certificates

1. **Dashboard**: Sign in and open "Dashboard"
2. **View Certificates**: See all issued certificates
3. **Search**: Filter by recipient, course, or UUID
4. **Revoke**: Click revoke button → confirm → certificate marked invalid
5. **Audit**: View complete lifecycle history

## 🔧 Configuration

### Environment Variables

Create `.env` file (optional, using defaults):

```env
# Devv SDK automatically uses project configuration
# No environment variables required for basic usage
```

### Database Schema

The application uses a Devv SDK table named `certificates`:

**Fields:**
- `_uid`: User ID (system field)
- `_id`: Unique ID (system field)
- `cert_uuid`: Certificate UUID (indexed)
- `recipient_name`: Certificate recipient
- `course_name`: Course/program name
- `issuer_name`: Issuing organization
- `issue_date`: ISO 8601 date
- `signature`: Base64 RSA-PSS signature
- `status`: 'active' | 'revoked' (indexed)
- `created_at`: ISO timestamp
- `created_by`: Issuer user ID
- `revoked_at`: Revocation timestamp (optional)
- `revoked_by`: Revoker user ID (optional)
- `audit_log`: JSON audit events array
- `notes`: Additional metadata (optional)

**Permissions:**
- Read: Public (anyone can verify)
- Write: Authorized (only logged-in users can issue)

## 🧪 Testing

### Manual Testing Checklist

**Authentication:**
- [ ] Sign in with email OTP
- [ ] Logout clears session
- [ ] Protected routes redirect when not authenticated

**Issuance:**
- [ ] Form validation works
- [ ] Certificate generates with signature
- [ ] PDF and PNG download automatically
- [ ] QR code contains verification URL
- [ ] Certificate saved to database

**Verification:**
- [ ] Valid certificate shows green badge
- [ ] Invalid signature shows red badge
- [ ] Revoked certificate shows revoked status
- [ ] QR code scanning works
- [ ] Audit log displays correctly

**Dashboard:**
- [ ] Lists all user certificates
- [ ] Search filters work
- [ ] Tab filters (all/active/revoked) work
- [ ] Revocation updates status
- [ ] Statistics update correctly

### Component Testing

```bash
# Run component tests (if configured)
npm test
```

## 📖 API Documentation

### Devv SDK Usage

**Authentication:**
```typescript
import { authService } from '@/lib/sdk';

// Send OTP
await authService.sendOTP('user@example.com');

// Verify and login
const user = await authService.verifyOTP('user@example.com', '123456');

// Logout
await authService.logout();
```

**Certificate Operations:**
```typescript
import { certificateService } from '@/lib/sdk';

// Create certificate
await certificateService.createCertificate({
  _uid: user.uid,
  cert_uuid: uuid,
  recipient_name: 'John Smith',
  course_name: 'Web Development',
  issuer_name: 'Tech Academy',
  issue_date: '2024-01-15',
  signature: 'base64_signature',
  status: 'active',
  created_at: new Date().toISOString(),
  created_by: user.uid,
  audit_log: JSON.stringify([...]),
  notes: ''
});

// Get certificate by UUID
const cert = await certificateService.getCertificateByUUID(uuid);

// Revoke certificate
await certificateService.revokeCertificate(cert, user.uid, 'reason');
```

**Cryptographic Operations:**
```typescript
import {
  createCanonicalPayload,
  signPayload,
  verifySignature,
  generateKeyPair
} from '@/lib/cert-utils';

// Create canonical payload
const payload = createCanonicalPayload({
  cert_uuid: uuid,
  recipient_name: 'John Smith',
  course_name: 'Web Dev',
  issuer_name: 'Academy',
  issue_date: '2024-01-15'
});

// Generate keys
const keyPair = await generateKeyPair();

// Sign
const signature = await signPayload(payload, keyPair.privateKey);

// Verify
const isValid = await verifySignature(payload, signature, keyPair.publicKey);
```

## 🐛 Troubleshooting

**Issue: "Public key not available for verification"**
- Cause: Certificate issued in different browser session
- Solution: Public keys are session-specific in demo mode. For production, publish keys at stable URLs.

**Issue: "Certificate not found"**
- Cause: Invalid UUID or certificate not in database
- Solution: Verify UUID is correct and certificate was successfully created

**Issue: "Failed to generate files"**
- Cause: Browser doesn't support html-to-image
- Solution: Use modern browser (Chrome, Firefox, Safari, Edge latest versions)

**Issue: Database query timeout**
- Cause: Index still provisioning (1-5 minutes after table creation)
- Solution: Wait a few minutes and retry

## 🚢 Deployment

### Vercel / Netlify

```bash
# Build
npm run build

# Deploy dist/ folder to hosting platform
```

### Environment Configuration

No environment variables required. Devv SDK automatically uses project configuration from the platform.

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

This is a demonstration project. For production use, please implement server-side signing as documented in the Security section.

## 📞 Support

For Devv SDK support, visit the Devv documentation or contact support through the platform.

---

**Security Summary**: This application demonstrates certificate issuance with digital signatures. It uses client-side signing for convenience, which is **NOT SECURE for production**. Production deployments must use server-side signing with HSM/KMS to protect private keys. Public key cryptography allows anyone to verify certificates without exposing secrets, making verification safe and transparent.
