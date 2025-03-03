import { useUser } from "@auth0/nextjs-auth0/client";

export default function LoginButton() {
  const { error, isLoading, user } = useUser();

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>;

  return (
    <div className="container min-h-screen flex items-center justify-center">
      <div className="card form-background w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6 text-black">
          Bem-vindo
        </h1>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}

        <a
          href="/api/auth/login"
          className="button-primary w-full flex items-center justify-center"
        >
          Login
        </a>
      </div>
    </div>
  );
}
