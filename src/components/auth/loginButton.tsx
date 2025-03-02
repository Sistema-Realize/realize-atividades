import { useUser } from "@auth0/nextjs-auth0/client";

export default function LoginButton() {
  const { error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>;

  return (
    <div>
      <a href="/form">Form</a>
      <a href="/api/auth/logout">Logout</a>
    </div>
  );
}
