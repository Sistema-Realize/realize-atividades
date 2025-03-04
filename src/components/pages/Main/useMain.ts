import { UserProfile } from "@auth0/nextjs-auth0/client";

interface UseMainProps {
  user: UserProfile | undefined;
}

export const useMain = ({ user }: UseMainProps) => {
  const userId = user?.sub as string ?? "";

  const isLoggedIn = !!userId;

  return {
    userId,
    isLoggedIn,
  };
};
