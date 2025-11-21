/**
 * Landing page for CertiChain application
 */

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AnimatedButton } from '@/components/ui/animated-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Shield,
  FileCheck,
  Search,
  Lock,
  Zap,
  Globe,
  CheckCircle2,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { 
  FadeIn, 
  SlideIn, 
  ScaleIn, 
  AnimatedCard, 
  FloatingElement,
  StaggerContainer,
  staggerItem 
} from '@/components/ui/animated-components';
import { motion } from 'framer-motion';

export function HomePage() {
  return (
    <div className="flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Hero Section */}
      <section className="container py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center space-y-8">
          <ScaleIn delay={0.1}>
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 rounded-full text-sm font-semibold text-primary dark:text-primary shadow-lg shadow-primary/10"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.3)" }}
            >
              <Shield className="w-4 h-4 text-primary" />
              Blockchain-inspired Certificate Security
              <Sparkles className="w-4 h-4 text-accent animate-pulse" />
            </motion.div>
          </ScaleIn>
          
          <FadeIn delay={0.2}>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              Digital Certificates with{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent">
                  Cryptographic Verification
                </span>
                <motion.span
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </span>
            </h1>
          </FadeIn>
          
          <SlideIn direction="up" delay={0.3}>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Issue, manage, and verify certificates with <span className="text-primary font-semibold">RSA-PSS digital signatures</span>.
              <br />Trust through transparency and cryptography.
            </p>
          </SlideIn>

          <SlideIn direction="up" delay={0.4}>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <AnimatedButton size="lg" asChild>
                <Link to="/issue" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all">
                  <FileCheck className="w-5 h-5 mr-2" />
                  Issue Certificate
                </Link>
              </AnimatedButton>
              <AnimatedButton size="lg" variant="outline" asChild>
                <Link to="/verify" className="border-primary/50 hover:border-primary hover:bg-primary/10 transition-all">
                  <Search className="w-5 h-5 mr-2 text-primary" />
                  <span className="text-primary font-semibold">Verify Certificate</span>
                </Link>
              </AnimatedButton>
            </div>
          </SlideIn>
        </div>
      </section>

      {/* Features */}
      <section className="container py-20 border-t">
        <div className="mx-auto max-w-6xl">
          <FadeIn delay={0.2}>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Why CertiChain?
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Modern certificate issuance with enterprise-grade security features
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid md:grid-cols-3 gap-6">
            <motion.div variants={staggerItem}>
              <AnimatedCard className="h-full" delay={0}>
                <CardHeader>
                  <FloatingElement>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Lock className="w-6 h-6 text-primary" />
                    </div>
                  </FloatingElement>
                  <CardTitle>Cryptographic Signatures</CardTitle>
                  <CardDescription>
                    Every certificate is signed with RSA-PSS digital signatures using SHA-256,
                    ensuring authenticity and preventing tampering.
                  </CardDescription>
                </CardHeader>
              </AnimatedCard>
            </motion.div>

            <motion.div variants={staggerItem}>
              <AnimatedCard className="h-full" delay={0.1}>
                <CardHeader>
                  <FloatingElement>
                    <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-6 h-6 text-success" />
                    </div>
                  </FloatingElement>
                  <CardTitle>Instant Verification</CardTitle>
                  <CardDescription>
                    Verify any certificate in seconds using its unique UUID and QR code.
                    Public key cryptography ensures independent verification.
                  </CardDescription>
                </CardHeader>
              </AnimatedCard>
            </motion.div>

            <motion.div variants={staggerItem}>
              <AnimatedCard className="h-full" delay={0.2}>
                <CardHeader>
                  <FloatingElement>
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                      <Globe className="w-6 h-6 text-accent" />
                    </div>
                  </FloatingElement>
                  <CardTitle>Immutable Audit Trail</CardTitle>
                  <CardDescription>
                    Complete audit logs track every certificate action from issuance to revocation,
                    creating an immutable record of events.
                  </CardDescription>
                </CardHeader>
              </AnimatedCard>
            </motion.div>

            <motion.div variants={staggerItem}>
              <AnimatedCard className="h-full" delay={0.3}>
                <CardHeader>
                  <FloatingElement>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Zap className="w-6 h-6 text-primary" />
                    </div>
                  </FloatingElement>
                  <CardTitle>Fast & Efficient</CardTitle>
                  <CardDescription>
                    Browser-based certificate generation with instant PDF and PNG export.
                    No server delays, certificates ready in seconds.
                  </CardDescription>
                </CardHeader>
              </AnimatedCard>
            </motion.div>

            <motion.div variants={staggerItem}>
              <AnimatedCard className="h-full" delay={0.4}>
                <CardHeader>
                  <FloatingElement>
                    <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-4">
                      <FileCheck className="w-6 h-6 text-success" />
                    </div>
                  </FloatingElement>
                  <CardTitle>Print-Ready Output</CardTitle>
                  <CardDescription>
                    High-resolution PNG and PDF certificates optimized for printing.
                    Professional design with embedded QR codes.
                  </CardDescription>
                </CardHeader>
              </AnimatedCard>
            </motion.div>

            <motion.div variants={staggerItem}>
              <AnimatedCard className="h-full" delay={0.5}>
                <CardHeader>
                  <FloatingElement>
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                      <Shield className="w-6 h-6 text-accent" />
                    </div>
                  </FloatingElement>
                  <CardTitle>Revocation Support</CardTitle>
                  <CardDescription>
                    Revoke certificates at any time with full audit trail.
                    Verification automatically checks revocation status.
                  </CardDescription>
                </CardHeader>
              </AnimatedCard>
            </motion.div>
          </StaggerContainer>
        </div>
      </section>

      {/* How It Works */}
      <section className="container py-20 border-t">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg">
              Simple three-step process for secure certificate issuance
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xl flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Issue Certificate</h3>
                <p className="text-muted-foreground">
                  Fill in recipient details, course name, and issuer information. The system generates
                  a unique UUID and creates a canonical payload for signing.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xl flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Digital Signature</h3>
                <p className="text-muted-foreground">
                  The certificate payload is signed using RSA-PSS cryptography with a 3072-bit key.
                  The signature is stored alongside the certificate data for verification.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xl flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Verify Anytime</h3>
                <p className="text-muted-foreground">
                  Anyone can verify a certificate using its UUID or QR code. The system reconstructs
                  the original payload and verifies the digital signature using the public key.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" asChild>
              <Link to="/issue">
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Security Note */}
      <section className="container py-20 border-t">
        <Card className="mx-auto max-w-3xl border-accent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent" />
              Security & Production Use
            </CardTitle>
            <CardDescription className="text-base">
              This application demonstrates certificate issuance with digital signatures.
              It uses <strong>client-side signing</strong> for demonstration purposes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">⚠️ Current Implementation (Demo)</h4>
              <p className="text-sm text-muted-foreground">
                Private keys are generated in the browser for each session. This is convenient
                for demos but not secure for production use.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">✅ Production Recommendations</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Use Hardware Security Modules (HSM) or Key Management Systems (KMS)</li>
                <li>Implement server-side signing with air-gapped private keys</li>
                <li>Rotate keys regularly and publish public keys at known URLs</li>
                <li>Enable certificate transparency logs for auditability</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export default HomePage;
