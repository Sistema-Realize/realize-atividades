import { UserProfile } from "@auth0/nextjs-auth0/client";

interface UseMainProps {
  user: UserProfile | undefined;
}

export const useMain = ({ user }: UseMainProps) => {
  const userId = user?.sid ?? "";

  return {
    userId,
  };
};
