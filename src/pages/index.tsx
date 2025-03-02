import React from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import LoginButton from "@/components/auth/loginButton";

function index() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>;

  if (user) {
    return <LoginButton />;
  }

  return <a href="/api/auth/login">Login</a>;
}

export default index;
