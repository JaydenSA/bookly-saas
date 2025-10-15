"use client";
import {KindeProvider} from "@kinde-oss/kinde-auth-nextjs";

export const AuthProvider = ({children }: {children: React.ReactNode}) => {
  return (
    <KindeProvider
      postLoginRedirectURL="/dashboard"
      postLogoutRedirectURL="/"
    >
      {children}
    </KindeProvider>
  );
};