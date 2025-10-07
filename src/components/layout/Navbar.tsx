"use client";

import Link from "next/link";
import { LoginLink, RegisterLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";

export default function Navbar() {
  const { user, isAuthenticated, isLoading } = useKindeAuth();

  return (
    <header className="text-gray-600 body-font bg-white border-b border-gray-200">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <Link href="/" className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <span className="ml-3 text-xl">Tailblocks</span>
        </Link>
        <nav className="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-200 flex flex-wrap items-center text-base justify-center">
          <Link href="#" className="mr-5 hover:text-gray-900">First Link</Link>
          <Link href="#" className="mr-5 hover:text-gray-900">Second Link</Link>
          <Link href="#" className="mr-5 hover:text-gray-900">Third Link</Link>
          <Link href="#" className="mr-5 hover:text-gray-900">Fourth Link</Link>
        </nav>

        {/* Right actions */}
        {isLoading ? (
          <div className="inline-flex items-center text-sm text-gray-500">Loading...</div>
        ) : isAuthenticated && user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">
                {user.given_name?.[0] || user.family_name?.[0] || user.email?.[0] || "U"}
              </div>
              <div className="ml-3 hidden sm:block">
                <div className="text-sm font-medium text-gray-900">{user.given_name || user.email}</div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>
            </div>
            <LogoutLink className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
              Log out
            </LogoutLink>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <LoginLink className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
              Sign in
            </LoginLink>
            <RegisterLink className="inline-flex items-center bg-indigo-600 text-white border-0 py-1 px-3 focus:outline-none hover:bg-indigo-700 rounded text-base mt-4 md:mt-0">
              Sign up
            </RegisterLink>
          </div>
        )}
      </div>
    </header>
  );
}


