# This file is only for editing file nodes, do not break the structure
## Project Description
CertiChain is a production-capable certificate issuance and verification system that uses RSA-PSS digital signatures to ensure authenticity. Users can issue certificates with embedded QR codes, verify them cryptographically, and manage them through an audit-trail dashboard. Built with React and Devv SDK for secure, decentralized certificate management.

## Key Features
- Certificate issuance with RSA-PSS digital signatures (3072-bit keys)
- Instant verification via UUID or QR code scanning
- High-resolution PDF and PNG certificate export
- Revocation support with complete audit trails
- Issuer dashboard for certificate management
- Email OTP authentication for secure access
- Public certificate verification (no auth required)

## Data Storage
Tables: certificates (f3opvib0vpq8) - stores certificate records with signatures and audit logs
Local: Public keys and key fingerprints stored in localStorage for verification

## Devv SDK Integration
Built-in: Authentication (Email OTP), Database (certificate table with public read, authorized write)
External: None required - fully functional with built-in services

## Special Requirements
⚠️ CLIENT-SIDE SIGNING WARNING: This implementation uses browser-based cryptographic signing for demonstration. 
Production deployments should use server-side signing with HSM/KMS to secure private keys.

Security note: Private keys are generated per-session in browser and never persisted. Public keys are stored
for verification purposes only.

/src
├── assets/          # Static resources directory
│
├── components/      # Components directory
│   ├── ui/         # Pre-installed shadcn/ui components
│   ├── AuthDialog.tsx # Email OTP authentication modal
│   ├── Header.tsx   # Application header with auth state
│   └── CertificateCanvas.tsx # Certificate rendering component with QR codes
│
├── hooks/          # Custom Hooks directory
│   ├── use-mobile.ts # Mobile detection Hook
│   ├── use-toast.ts  # Toast notification system Hook
│   └── useAuth.ts   # Authentication state management hook
│
├── lib/            # Utility library directory
│   ├── utils.ts    # Utility functions, including cn function for merging Tailwind classes
│   ├── types.ts    # TypeScript type definitions for certificates and signatures
│   ├── sdk.ts      # Devv SDK wrapper for auth and database operations
│   └── cert-utils.ts # Certificate utilities: signing, verification, payload creation
│
├── pages/          # Page components directory (React Router structure)
│   ├── HomePage.tsx # Landing page with features and how-it-works
│   ├── IssuePage.tsx # Certificate issuance form with client-side signing
│   ├── VerifyPage.tsx # Certificate verification with signature validation
│   ├── DashboardPage.tsx # Issuer dashboard for certificate management
│   └── NotFoundPage.tsx # 404 error page
│
├── App.tsx         # Root component with React Router configuration
│                   # Routes: /, /issue, /verify, /verify/:certUuid, /dashboard
│
├── main.tsx        # Entry file, renders root component and mounts to DOM
│
├── index.css       # Global styles with CertiChain design system (trust blue theme)
│
└── tailwind.config.js  # Tailwind CSS v3 configuration file