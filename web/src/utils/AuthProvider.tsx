import { CloseCircleOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import React, { useContext, useState } from "react";
import { clearQueryCache, refetchQuery, useMutation } from "react-query";
import { useHistory } from "react-router";
import { clearToken, setAuthToken } from "../dao/base";
import { Settings } from "../dao/settings";
import { postLogin, postLogout, User, useUser } from "../dao/user";

interface AuthContext {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  settings?: Settings;
  login: (values: Record<string, string>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContext>({} as any);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC = ({ children }) => {
  const history = useHistory();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { data: user, isLoading, error } = useUser();
  const [doLogin] = useMutation(postLogin);
  const [doLogout] = useMutation(postLogout);

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
        settings: user?.settings,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
