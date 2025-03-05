import { useUser } from '@auth0/nextjs-auth0/client';
import { createContext, useContext } from 'react';

interface UserContextType {
  userId: string;
  isLoggedIn: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserContextProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const userId = user?.sub as string ?? "";
  const isLoggedIn = !!userId;

  return (
    <UserContext.Provider value={{ userId, isLoggedIn }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserContextProvider');
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