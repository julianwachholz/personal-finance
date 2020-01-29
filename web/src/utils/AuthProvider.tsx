import { CloseCircleOutlined } from "@ant-design/icons";
import * as Sentry from "@sentry/browser";
import { Modal } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { clearQueryCache, refetchQuery, useMutation } from "react-query";
import { clearToken, setAuthToken } from "../dao/base";
import { Settings } from "../dao/settings";
import {
  isPossiblyAuthenticated,
  postLogin,
  postLogout,
  User,
  useUser
} from "../dao/user";

interface AuthContext {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  settings?: Settings;
  login: (values: Record<string, string>) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthContext>({} as any);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC = ({ children }) => {
  const { i18n } = useTranslation(undefined, { useSuspense: false });
  const [isAuthenticated, setIsAuthenticated] = useState(
    isPossiblyAuthenticated()
  );
  const { data: user, isLoading, error } = useUser(isAuthenticated);
  const [doLogin] = useMutation(postLogin);
  const [doLogout] = useMutation(postLogout);

  useEffect(() => {
    if (isAuthenticated) {
      if (user) {
        i18n.changeLanguage(user.settings.language);
        Sentry.configureScope(scope => {
          scope.setUser({
            id: user.pk.toString(),
            username: user.username,
            email: user.email
          });
        });
      }
    } else {
      clearToken();
      refetchQuery("user");
      clearQueryCache();
    }
  }, [isAuthenticated, isLoading, user]);

  if (error) {
    return (
      <Modal
        className="ant-modal-confirm-error ant-modal-confirm-body-wrapper"
        visible
        closable={false}
        footer={false}
      >
        <div className="ant-modal-confirm-body">
          <CloseCircleOutlined />
          <span className="ant-modal-confirm-title">Temporary Error</span>
          <div className="ant-modal-confirm-content">
            <p>
              We are experiencing some internal difficulties, please try again
              later.
            </p>
            <p>
              Error Code: <pre>{error.message}</pre>
            </p>
          </div>
        </div>
      </Modal>
    );
  }

  const login = async (values: Record<string, string>) => {
    const result = await doLogin(values);
    setAuthToken(result.token, result.expiry);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await doLogout();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated,
        user,
        settings: user?.settings,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
