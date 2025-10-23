"use client";

import Link from "next/link";
import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs";
import { User, Settings, LogOut, Sun, Moon, Monitor, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/providers/ThemeProvider";

export default function Navbar() {
  const { user, isLoaded } = useUser();
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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="w-8 h-8 bg-[#2ECC71] rounded flex items-center justify-center mr-2">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <span className="text-xl font-bold text-[#1A4D4D]">Local</span>
            <span className="text-xl font-bold text-[#2ECC71]">finder</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/#features" className="text-gray-700 hover:text-[#2ECC71] transition-colors">Features</Link>
            <Link href="/#pricing" className="text-gray-700 hover:text-[#2ECC71] transition-colors">Pricing</Link>
            <Link href="/#testimonials" className="text-gray-700 hover:text-[#2ECC71] transition-colors">Testimonials</Link>
            <Link href="/discover" className="text-gray-700 hover:text-[#2ECC71] transition-colors">Discover</Link>
          </nav>

          {/* Right actions */}
          {!isLoaded ? (
            <div className="text-gray-500">Loading...</div>
          ) : user ? (
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <Button variant="ghost" size="icon" onClick={toggleTheme} title={`Current theme: ${theme}`}>
                {getThemeIcon()}
              </Button>
              
              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-50">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-[#2ECC71] text-white text-sm">
                        {user.firstName?.[0] || user.lastName?.[0] || user.emailAddresses[0]?.emailAddress?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium text-gray-900">
                        {user.firstName || user.emailAddresses[0]?.emailAddress}
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2 border-b">
                    <div className="text-sm font-medium text-gray-900">
                      {user.firstName || user.emailAddresses[0]?.emailAddress}
                    </div>
                    <div className="text-sm text-gray-500">
                      {user.emailAddresses[0]?.emailAddress}
                    </div>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center w-full cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard#settings" className="flex items-center w-full cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <SignOutButton>
                      <span className="flex items-center w-full cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </span>
                    </SignOutButton>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <Button variant="ghost" size="icon" onClick={toggleTheme} title={`Current theme: ${theme}`}>
                {getThemeIcon()}
              </Button>
              
              <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                <Button variant="ghost" className="text-gray-700 hover:text-[#2ECC71]">
                  Sign in
                </Button>
              </SignInButton>
              <SignInButton mode="modal" fallbackRedirectUrl="/welcome">
                <Button className="bg-[#2ECC71] hover:bg-[#27AE60] text-white">
                  Sign up
                </Button>
              </SignInButton>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}


