import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <Link href="/api/auth/login" legacyBehavior>
        <a className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-accent-color text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44">
          Login
        </a>
      </Link>
    </div>
  );
}
