"use client";
import { useEffect, useState } from "react";
import LoginButton from "@/components/auth/loginButton";
import LogoutButton from "@/components/auth/logoutButton";
import SignupButton from "@/components/auth/signupButton";

export default function Home() {
  const [user, setUser] = useState<{
    name: string;
    email: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const session = await fetch("/api/auth/me");
        const data = await session.json();
        if (data.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      {user ? (
        <>
          <h1 className="text-2xl font-bold">Bem-vindo, {user.name}!</h1>
          <p className="text-gray-600">Você está autenticado.</p>
          <LogoutButton />
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold">Realize Login</h1>
          <p className="text-gray-600">
            Para continuar, faça login ou cadastre-se.
          </p>
          <div className="mt-4 flex gap-4">
            <SignupButton />
            <LoginButton />
          </div>
        </>
      )}
    </main>
  );
}
