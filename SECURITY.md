# Security Documentation

## Overview

CertiChain implements certificate issuance and verification using **RSA-PSS digital signatures** with SHA-256 hashing. This document explains the security architecture, threat model, and production recommendations.

## Current Implementation (Demo Mode)

### Client-Side Signing

**How it works:**
1. User initiates certificate issuance
2. Browser generates RSA-PSS key pair (3072-bit) using Web Crypto API
3. Canonical payload created with deterministic JSON serialization
4. Private key signs payload in browser memory
5. Signature (Base64) stored in database with certificate
6. Public key stored in localStorage for verification
7. Private key discarded after signing (not persisted)

**Security Limitations:**
- ⚠️ Private keys exposed in browser memory
- ⚠️ Vulnerable to XSS attacks
- ⚠️ No key persistence across sessions
- ⚠️ Browser-based vulnerabilities
- ⚠️ Not suitable for production use

**Why use it?**
- Zero server infrastructure required
- Instant deployment
- Perfect for demos and proof-of-concepts
- Educational purposes

## Production Recommendations

### 1. Server-Side Signing Architecture

```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│   Client    │──────▶│  API Server  │──────▶│  HSM / KMS  │
│  (Browser)  │       │              │       │ (Private Key)│
└─────────────┘       └──────────────┘       └─────────────┘
     │                       │                        │
     │ 1. Send payload       │ 2. Request signature   │
     │                       │                        │
     │ 4. Receive signature  │ 3. Return signature    │
     └───────────────────────┴────────────────────────┘
```

**Implementation:**

```typescript
// Server-side signing endpoint (Node.js example)
import { SignJWT } from 'jose';
import { readFileSync } from 'fs';

app.post('/api/sign-certificate', async (req, res) => {
  // 1. Validate request authentication
  const user = await validateAuth(req.headers.authorization);
  
  // 2. Validate payload
  const payload = validateCertificatePayload(req.body);
  
  // 3. Load private key from secure storage (HSM/KMS)
  const privateKey = await loadPrivateKeyFromHSM();
  
  // 4. Sign payload
  const signature = await signPayload(payload, privateKey);
  
  // 5. Return signature only (never expose private key)
  res.json({ signature });
});
```

### 2. Hardware Security Module (HSM)

**AWS CloudHSM Example:**

```typescript
import { CloudHSMClient, SignCommand } from '@aws-sdk/client-cloudhsm';

async function signWithHSM(payload: Buffer): Promise<string> {
  const client = new CloudHSMClient({ region: 'us-east-1' });
  
  const command = new SignCommand({
    KeyId: process.env.HSM_KEY_ID,
    Message: payload,
    SigningAlgorithm: 'RSA_PSS_SHA256'
  });
  
  const response = await client.send(command);
  return Buffer.from(response.Signature).toString('base64');
}
```

**Benefits:**
- Private keys never leave HSM
- FIPS 140-2 Level 3 compliance
- Tamper-resistant hardware
- Automatic key rotation
- Audit logging

### 3. Key Management System (KMS)

**Google Cloud KMS Example:**

```typescript
import { KeyManagementServiceClient } from '@google-cloud/kms';

async function signWithKMS(payload: Buffer): Promise<string> {
  const client = new KeyManagementServiceClient();
  
  const [signResponse] = await client.asymmetricSign({
    name: process.env.KMS_KEY_NAME,
    digest: {
      sha256: createHash('sha256').update(payload).digest()
    }
  });
  
  return Buffer.from(signResponse.signature).toString('base64');
}
```

**Benefits:**
- Centralized key management
- Automatic backups
- Access control policies
- Integration with cloud services
- Cost-effective

### 4. Air-Gapped Signing Service

**Architecture:**

```
Internet  │  DMZ           │  Secure Zone
          │                │
┌────────┐│  ┌──────────┐ │  ┌──────────┐
│ Client │──▶│ API      │─┼─▶│ Signing  │
│        │   │ Gateway  │    │ Service  │
└────────┘   └──────────┘    └──────────┘
             │ (Firewall) │  (No Internet)
             │            │  (Private Keys)
```

**Implementation:**
1. API gateway receives signing requests
2. Validates and queues requests
3. Air-gapped service polls queue
4. Signs payload with stored private key
5. Returns signature via secure channel
6. API gateway returns to client

**Benefits:**
- Maximum security
- Private keys never exposed to internet
- Offline key storage
- Manual key import/export process

## Key Management Best Practices

### Key Generation

```bash
# Generate 3072-bit RSA key pair
openssl genpkey -algorithm RSA \
  -out issuer_private.pem \
  -pkeyopt rsa_keygen_bits:3072

# Extract public key
openssl rsa -in issuer_private.pem \
  -pubout -out issuer_public.pem

# Generate fingerprint
openssl dgst -sha256 issuer_public.pem
```

### Key Storage

**Private Keys:**
- Store in HSM or KMS only
- Never commit to version control
- Encrypt at rest with AES-256
- Use strict access controls
- Enable audit logging

**Public Keys:**
- Publish at known URLs: `https://yourorg.com/.well-known/keys/issuer_public.pem`
- Include in certificate as metadata
- Version keys: `issuer_public_v1.pem`, `issuer_public_v2.pem`
- Document fingerprints

### Key Rotation

```typescript
// Key rotation strategy
interface KeyVersion {
  version: number;
  publicKey: string;
  fingerprint: string;
  validFrom: Date;
  validUntil: Date | null;
  status: 'active' | 'deprecated' | 'revoked';
}

const keyRegistry: KeyVersion[] = [
  {
    version: 1,
    publicKey: '-----BEGIN PUBLIC KEY-----...',
    fingerprint: 'SHA256:abc123...',
    validFrom: new Date('2024-01-01'),
    validUntil: new Date('2024-12-31'),
    status: 'deprecated'
  },
  {
    version: 2,
    publicKey: '-----BEGIN PUBLIC KEY-----...',
    fingerprint: 'SHA256:def456...',
    validFrom: new Date('2024-12-01'),
    validUntil: null,
    status: 'active'
  }
];
```

**Rotation Schedule:**
- Rotate keys every 12 months minimum
- Support 30-day overlap period
- Deprecate old keys before revoking
- Update public key registry immediately

## Verification Security

### Public Key Distribution

**Option 1: URL-based**
```
https://yourorg.com/.well-known/keys/
  ├── issuer_public_v1.pem
  ├── issuer_public_v2.pem
  └── registry.json
```

**Option 2: Certificate metadata**
```json
{
  "cert_uuid": "...",
  "signature": "...",
  "publicKeyUrl": "https://yourorg.com/keys/v2.pem",
  "keyFingerprint": "SHA256:abc123..."
}
```

**Option 3: Blockchain/IPFS**
- Store public keys on blockchain
- Content-addressed storage (IPFS)
- Immutable public key registry

### Signature Verification Process

```typescript
async function verifyProductionCertificate(
  cert: Certificate
): Promise<VerificationResult> {
  // 1. Fetch current public key
  const publicKey = await fetchPublicKey(cert.keyVersion);
  
  // 2. Verify key fingerprint matches
  const fingerprint = await computeFingerprint(publicKey);
  if (fingerprint !== cert.keyFingerprint) {
    return { verified: false, reason: 'Key fingerprint mismatch' };
  }
  
  // 3. Check key status
  if (publicKey.status === 'revoked') {
    return { verified: false, reason: 'Signing key revoked' };
  }
  
  // 4. Reconstruct canonical payload
  const payload = createCanonicalPayload(cert);
  
  // 5. Verify signature
  const isValid = await verifySignature(
    payload,
    cert.signature,
    publicKey
  );
  
  // 6. Check certificate revocation status
  if (cert.status === 'revoked') {
    return { verified: false, reason: 'Certificate revoked' };
  }
  
  return {
    verified: isValid,
    reason: isValid ? 'Valid signature' : 'Invalid signature',
    keyVersion: cert.keyVersion,
    fingerprint
  };
}
```

## Threat Model

### Threats Addressed

✅ **Signature Forgery**
- Mitigation: RSA-PSS 3072-bit keys, cryptographically infeasible to forge

✅ **Certificate Tampering**
- Mitigation: Any modification invalidates signature

✅ **Replay Attacks**
- Mitigation: Unique UUID per certificate, timestamp verification

✅ **Revocation Bypass**
- Mitigation: Verification checks revocation status from database

### Threats NOT Addressed in Demo

⚠️ **Private Key Compromise (Client-Side)**
- Risk: XSS, browser vulnerabilities expose keys
- Mitigation: Use server-side signing

⚠️ **Key Persistence**
- Risk: Keys not stored, verification limited to session
- Mitigation: Publish public keys at stable URLs

⚠️ **Man-in-the-Middle**
- Risk: Public key substitution during verification
- Mitigation: HTTPS, certificate pinning, key fingerprints

## Compliance Considerations

### GDPR
- Certificate data may contain PII (names)
- Implement data retention policies
- Support right to erasure (with audit trail)
- Document data processing activities

### SOC 2
- Audit logging for all certificate actions
- Access controls for issuance
- Key management documentation
- Incident response procedures

### Industry Standards
- **X.509**: Consider X.509 certificate format for wider compatibility
- **PKI**: Implement full PKI infrastructure for enterprise use
- **Certificate Transparency**: Publish certificates to CT logs

## Incident Response

### Compromised Private Key

1. **Immediate Actions:**
   - Revoke compromised key in registry
   - Generate new key pair
   - Publish new public key
   - Notify certificate holders

2. **Certificate Reissuance:**
   - Mark all certificates signed with compromised key
   - Provide reissuance workflow
   - Update verification to check key status

3. **Investigation:**
   - Audit logs for unauthorized access
   - Determine compromise scope
   - Document findings

### Signature Verification Failure

1. **Verify payload reconstruction**
2. **Check public key version**
3. **Confirm key fingerprint**
4. **Review audit logs**
5. **Contact issuer if persistent**

## Migration Path

### From Demo to Production

**Phase 1: Add Server-Side Signing**
```typescript
// Replace client-side signing
const signature = await signPayload(payload, privateKey);

// With server call
const signature = await fetch('/api/sign', {
  method: 'POST',
  body: JSON.stringify({ payload }),
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json()).then(d => d.signature);
```

**Phase 2: Implement HSM/KMS**
- Migrate keys to HSM
- Update signing service
- Test thoroughly

**Phase 3: Publish Public Keys**
- Create key registry
- Host at stable URL
- Update verification logic

**Phase 4: Key Rotation**
- Implement rotation schedule
- Support multiple key versions
- Deprecate old keys

## Conclusion

This demonstration uses client-side signing for convenience and zero-infrastructure deployment. **For production use**, implement server-side signing with HSM/KMS. The cryptographic principles remain the same—only the key management changes.

**Remember:** The security of the entire system depends on keeping private keys secure. No amount of cryptographic sophistication can overcome a compromised private key.
