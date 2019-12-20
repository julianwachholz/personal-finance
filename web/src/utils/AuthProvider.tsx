import React, { useContext, useState } from "react";
import { IUser, useUser } from "../dao/user";

interface AuthContext {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: IUser | null;
}

const AuthContext = React.createContext<AuthContext>({} as any);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { data: user, isLoading } = useUser();

  console.log(`Auth: user: ${user}`);
  console.log(`Auth: isLoading: ${isLoading}`);
  console.log(`Auth: isAuthenticated: ${isAuthenticated}`);

  if (!isAuthenticated) {
    if (!isLoading && user) {
      setIsAuthenticated(true);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated,
        user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
