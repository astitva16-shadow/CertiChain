/**
 * Issuer dashboard for managing certificates
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  FileCheck,
  Shield,
  Loader2,
  ExternalLink,
  Ban,
  CheckCircle2,
  Search,
  Filter
} from 'lucide-react';
import { getCertificatesForUser, revokeCertificate } from '@/lib/certificates';
import { useToast } from '@/hooks/use-toast';
import type { CertificateRecord } from '@/lib/types';
import { AuthDialog } from '@/components/AuthDialog';

export function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
  const [filteredCerts, setFilteredCerts] = useState<CertificateRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'revoked'>('all');
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadCertificates();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    filterCertificates();
  }, [certificates, searchQuery, activeTab]);

  const loadCertificates = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await getCertificatesForUser(user.id);
      if (error) {
        throw error;
      }
      setCertificates(data || []);
    } catch (error) {
      console.error('Failed to load certificates:', error);
      toast({
        title: 'Error',
        description: 'Failed to load certificates',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterCertificates = () => {
    let filtered = certificates;

    // Filter by status
    if (activeTab === 'active') {
      filtered = filtered.filter(cert => cert.status === 'active');
    } else if (activeTab === 'revoked') {
      filtered = filtered.filter(cert => cert.status === 'revoked');
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(cert =>
        cert.recipient_name.toLowerCase().includes(query) ||
        cert.course_name.toLowerCase().includes(query) ||
        cert.certificate_id.toLowerCase().includes(query)
      );
    }

    setFilteredCerts(filtered);
  };

  const handleRevoke = async (cert: CertificateRecord) => {
    try {
      const { error } = await revokeCertificate(cert.certificate_id);
      if (error) {
        throw error;
      }

      toast({
        title: 'Certificate revoked',
        description: 'The certificate has been successfully revoked'
      });

      await loadCertificates();
    } catch (error) {
      console.error('Failed to revoke certificate:', error);
      toast({
        title: 'Error',
        description: 'Failed to revoke certificate',
        variant: 'destructive'
      });
    }
  };

  const formatDate = (isoDate: string) => {
    return new Date(isoDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStats = () => {
    const total = certificates.length;
    const active = certificates.filter(c => c.status === 'active').length;
    const revoked = certificates.filter(c => c.status === 'revoked').length;
    return { total, active, revoked };
  };

  if (!isAuthenticated) {
    return (
      <div className="container max-w-2xl py-12">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Sign in Required</CardTitle>
            <CardDescription>
              You must be signed in to view your certificate dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setShowAuthDialog(true)} className="w-full">
              Sign in to Continue
            </Button>
          </CardContent>
        </Card>
        <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="container max-w-7xl py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Certificate Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and monitor your issued certificates
          </p>
        </div>
        <Button asChild>
          <Link to="/issue">
            <FileCheck className="w-4 h-4 mr-2" />
            Issue New Certificate
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Issued</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-success" />
              Active
            </CardDescription>
            <CardTitle className="text-3xl text-success">{stats.active}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-1">
              <Ban className="w-4 h-4 text-destructive" />
              Revoked
            </CardDescription>
            <CardTitle className="text-3xl text-destructive">{stats.revoked}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Certificates List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Certificates</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search certificates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList>
              <TabsTrigger value="all">
                All <Badge variant="secondary" className="ml-2">{stats.total}</Badge>
              </TabsTrigger>
              <TabsTrigger value="active">
                Active <Badge variant="secondary" className="ml-2">{stats.active}</Badge>
              </TabsTrigger>
              <TabsTrigger value="revoked">
                Revoked <Badge variant="secondary" className="ml-2">{stats.revoked}</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : filteredCerts.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    {searchQuery
                      ? 'No certificates match your search'
                      : 'No certificates found. Issue your first certificate to get started.'}
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Recipient</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Issued</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCerts.map((cert) => (
                        <TableRow key={cert.id}>
                          <TableCell className="font-medium">
                            {cert.recipient_name}
                          </TableCell>
                          <TableCell>{cert.course_name}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(cert.issued_at)}
                          </TableCell>
                          <TableCell>
                            {cert.status === 'active' ? (
                              <Badge variant="default" className="bg-success">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="destructive">
                                <Ban className="w-3 h-3 mr-1" />
                                Revoked
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                asChild
                              >
                                <Link to={`/verify/${cert.certificate_id}`}>
                                  <ExternalLink className="w-4 h-4" />
                                </Link>
                              </Button>
                              {cert.status === 'active' && (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="text-destructive">
                                      <Ban className="w-4 h-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Revoke Certificate?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will revoke the certificate for <strong>{cert.recipient_name}</strong>.
                                        This action cannot be undone. The certificate will be marked as invalid.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleRevoke(cert)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Revoke Certificate
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default DashboardPage;
