"use client";
import Link from "next/link";

export default function SignupButton() {
  return (
    <Link href="/api/auth/login?screen_hint=signup">
      <button className="px-4 py-2 bg-blue-500 text-white rounded">
        Criar Conta
      </button>
    </Link>
  );
}
