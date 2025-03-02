"use client";
import Link from "next/link";

export default function LoginButton() {
  return (
    <Link href="/api/auth/login">
      <button className="px-4 py-2 bg-green-500 text-white rounded">
        Entrar
      </button>
    </Link>
  );
}
