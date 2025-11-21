/**
 * Application header with authentication state
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { AuthDialog } from './AuthDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Shield, User, LogOut, FileCheck, LayoutDashboard } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { motion } from 'framer-motion';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <div className="p-1.5 bg-primary rounded-lg">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl">CertiChain</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link
              to="/issue"
              className={`transition-colors hover:text-primary ${
                isActive('/issue') ? 'text-primary font-medium' : 'text-muted-foreground'
              }`}
            >
              Issue Certificate
            </Link>
            <Link
              to="/verify"
              className={`transition-colors hover:text-primary ${
                isActive('/verify') ? 'text-primary font-medium' : 'text-muted-foreground'
              }`}
            >
              Verify
            </Link>
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className={`transition-colors hover:text-primary ${
                  isActive('/dashboard') ? 'text-primary font-medium' : 'text-muted-foreground'
                }`}
              >
                Dashboard
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    {user.name || user.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.name || 'User'}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/issue" className="cursor-pointer">
                      <FileCheck className="w-4 h-4 mr-2" />
                      Issue Certificate
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button size="sm" onClick={() => setShowAuthDialog(true)}>
                Sign in
              </Button>
            )}
          </div>
        </div>
      </motion.header>

      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onSuccess={() => {}}
      />
    </>
  );
}
