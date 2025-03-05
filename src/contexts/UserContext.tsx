import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

interface UserContextType {
  userId: string;
  isLoggedIn: boolean;
  isSubscriptionActive: boolean;
  fullName: string;
  setFullName: (value: string) => void;
  cpfCnpj: string;
  setCpfCnpj: (value: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();
  const userId = (user?.sub as string) ?? "";
  const isLoggedIn = !!userId;
  const [isSubscriptionActive, setIsSubscriptionActive] = useState(false);
  const [fullName, setFullName] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (!isLoggedIn) return;
      const response = await fetch(`/api/subscription`, {
        method: "GET",
      });
      const data = await response.json();
      setIsSubscriptionActive(data.isActive);
    };
    fetchSubscriptionStatus();
  }, [isLoggedIn, userId]);

  return (
    <UserContext.Provider
      value={{
        userId,
        isLoggedIn,
        isSubscriptionActive,
        fullName,
        setFullName,
        cpfCnpj,
        setCpfCnpj,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }
  return context;
}

export function withUserContext<T extends object>(
  WrappedComponent: React.ComponentType<T>
) {
  return function WithUserContextComponent(props: T) {
    return (
      <UserContextProvider>
        <WrappedComponent {...props} />
      </UserContextProvider>
    );
  };
}
