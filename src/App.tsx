/**
 * Main application component with routing
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Toaster } from './components/ui/toaster';
import { ThemeProvider } from './components/ThemeProvider';
import HomePage from './pages/HomePage';
import IssuePage from './pages/IssuePage';
import VerifyPage from './pages/VerifyPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import { Alert, AlertDescription, AlertTitle } from './components/ui/alert';
import { AlertCircle } from 'lucide-react';

function App() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const isConfigured = supabaseUrl && supabaseAnonKey;

  return (
    <ThemeProvider defaultTheme="system" storageKey="certichain-theme">
      <Router>
        <div className="min-h-screen flex flex-col">
        <Header />
        {!isConfigured && (
          <div className="container py-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Configuration Error</AlertTitle>
              <AlertDescription>
                Environment variables are not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
              </AlertDescription>
            </Alert>
          </div>
        )}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/issue" element={<IssuePage />} />
            <Route path="/verify" element={<VerifyPage />} />
            <Route path="/verify/:certUuid" element={<VerifyPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <footer className="border-t py-6 text-center text-sm text-muted-foreground">
          <div className="container">
            <p>
              CertiChain © {new Date().getFullYear()} • Secure certificate issuance with digital signatures
            </p>
          </div>
        </footer>
      </div>
      <Toaster />
      </Router>
    </ThemeProvider>
  );
}

export default App;
