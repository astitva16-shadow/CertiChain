/**
 * Authentication dialog with email OTP flow
 */

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Mail, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AuthDialog({ open, onOpenChange, onSuccess }: AuthDialogProps) {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { sendOTP, login } = useAuth();
  const { toast } = useToast();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await sendOTP(email);
      setStep('otp');
      toast({
        title: 'Verification code sent',
        description: `Check ${email} for your 6-digit code`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send verification code. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, code);
      toast({
        title: 'Login successful',
        description: 'Welcome to CertiChain',
      });
      onOpenChange(false);
      onSuccess?.();
      
      // Reset state
      setStep('email');
      setEmail('');
      setCode('');
    } catch (error) {
      toast({
        title: 'Invalid code',
        description: 'Please check your code and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep('email');
    setCode('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle>Sign in to CertiChain</DialogTitle>
          </div>
          <DialogDescription>
            {step === 'email'
              ? 'Enter your email to receive a verification code'
              : 'Enter the 6-digit code sent to your email'}
          </DialogDescription>
        </DialogHeader>

        {step === 'email' ? (
          <form onSubmit={handleSendOTP} className="space-y-4" key="email">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  autoFocus
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending code...
                </>
              ) : (
                'Send verification code'
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4" key="otp">
            <div className="space-y-2">
              <Label htmlFor="code">Verification code</Label>
              <Input
                id="code"
                type="text"
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                required
                autoFocus
                className="text-center text-2xl tracking-widest"
              />
              <p className="text-xs text-muted-foreground">
                Code sent to {email}
              </p>
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleBack} className="w-full">
                Back
              </Button>
              <Button type="submit" className="w-full" disabled={isLoading || code.length !== 6}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify & Sign in'
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
