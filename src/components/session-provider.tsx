import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { User } from 'types/user';

type Session = {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
};

const SessionContext = createContext<Session>({
  user: null,
  setUser: () => {},
  clearUser: () => {},
});

type SessionProviderProps = {
  children: ReactNode;
  initialUser: User | null;
};

export function useSession(): Session {
  return useContext(SessionContext);
}

export function useProfile(): User | null {
  const { user } = useSession();
  return user;
}

export function SessionProvider({
  children,
  initialUser,
}: SessionProviderProps) {
  const [user, setUser] = useState(initialUser);
  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      clearUser: () => setUser(null),
    }),
    [user]
  );
  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
}
