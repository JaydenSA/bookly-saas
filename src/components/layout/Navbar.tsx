"use client";

import Link from "next/link";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { LogOut, Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/providers/ThemeProvider";
import NotificationBell from "@/components/NotificationBell";

export default function Navbar() {
  const { user, isAuthenticated, isLoading } = useKindeAuth();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <header className="navbar-layout">
      <div className="navbar-container general-container">
        <Link href="/" className="navbar-brand">
          <div className="navbar-brand-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="navbar-brand-icon-svg" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <span className="navbar-brand-text">BookFlow</span>
        </Link>
        <nav className="navbar-nav">
          <a href="#features" className="navbar-nav-link">Features</a>
          <a href="#pricing" className="navbar-nav-link">Pricing</a>
          <a href="#testimonials" className="navbar-nav-link">Testimonials</a>
          <Link href="/discover" className="navbar-nav-link">Discover</Link>
        </nav>

          {/* Right actions */}
          {isLoading ? (
            <div className="navbar-loading">Loading...</div>
          ) : isAuthenticated && user ? (
            <div className="navbar-actions">
              <div className="navbar-user-info">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.given_name?.[0] || user.family_name?.[0] || user.email?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="navbar-user-details">
                  <div className="navbar-user-name">{user.given_name || user.email}</div>
                  <div className="navbar-user-email">{user.email}</div>
                </div>
              </div>
              
              {/* Notification Bell */}
              <NotificationBell />
              
              {/* Theme Toggle */}
              <Button variant="ghost" size="icon" onClick={toggleTheme} title={`Current theme: ${theme}`}>
                {getThemeIcon()}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/logout" className="w-full cursor-pointer">
                      Log out
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="navbar-auth-actions">
              {/* Theme Toggle */}
              <Button variant="ghost" size="icon" onClick={toggleTheme} title={`Current theme: ${theme}`}>
                {getThemeIcon()}
              </Button>
              
              <Button variant="ghost" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Sign up</Link>
              </Button>
            </div>
          )}
      </div>
    </header>
  );
}


