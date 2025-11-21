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

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="certichain-theme">
      <Router>
        <div className="min-h-screen flex flex-col">
        <Header />
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
