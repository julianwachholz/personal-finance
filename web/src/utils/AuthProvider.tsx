import React, { useContext, useState } from "react";
import { clearQueryCache, refetchQuery, useMutation } from "react-query";
import { useHistory } from "react-router";
import { clearToken, setAuthToken } from "../dao/base";
import { postLogin, postLogout, User, useUser } from "../dao/user";

interface AuthContext {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  login: (values: Record<string, string>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContext>({} as any);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC = ({ children }) => {
  const history = useHistory();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { data: user, isLoading } = useUser();
  const [doLogin] = useMutation(postLogin);
  const [doLogout] = useMutation(postLogout);

  if (!isAuthenticated) {
    if (!isLoading && user) {
      setIsAuthenticated(true);
    }
  }
  if (isAuthenticated && !user) {
    setIsAuthenticated(false);
  }

  const login = async (values: Record<string, string>) => {
    const result = await doLogin(values);
    setAuthToken(result.token, result.expiry);
    await refetchQuery("user");
    history.push(`/`);
  };

  const logout = async () => {
    await doLogout();
    clearToken();
    refetchQuery("user");
    clearQueryCache();
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated,
        user,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
