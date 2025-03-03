import React from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import LoginButton from "@/components/auth/loginButton";

export default function LoginPage() {
  const { user, error, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="container min-h-screen flex items-center justify-center">
        <div className="card animate-pulse">
          <p className="text-center text-[var(--muted-color)]">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container min-h-screen flex items-center justify-center">
        <div className="card">
          <p className="text-red-600">{error.message}</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <LoginButton />;
  }

  return (
    <div className="container min-h-screen flex items-center justify-center">
      <div className="card form-background w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6 text-[var(--foreground)]">
          Bem-vindo
        </h1>

        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}

        <a
          href="/form"
          className="button-primary w-full flex items-center justify-center"
        >
          Login
        </a>
      </div>
    </div>
  );
}
