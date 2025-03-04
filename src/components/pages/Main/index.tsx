import { useUser } from "@auth0/nextjs-auth0/client";
import LoginButton from "@/components/auth/LoginButton";
import Form from "@/components/pages/Form";
import { useMain } from "./useMain";

export default function MainPage() {
  const { user, error, isLoading } = useUser();
  const { userId } = useMain({ user });

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
    return <Form userId={userId} />;
  }

  return <LoginButton />;
} 