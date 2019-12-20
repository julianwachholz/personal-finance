import { Button, Switch } from "antd";
import React, { useState } from "react";
import { useAuth } from "../../utils/AuthProvider";
import { useSettings } from "../../utils/SettingsProvider";
import BaseModule from "../base/BaseModule";

const Dashboard: React.FC = () => {
  const { theme, toggleTheme } = useSettings();
  const { isAuthenticated, user, logout } = useAuth();

  const [loading, setLoading] = useState(false);

  return (
    <BaseModule title="Dashboard">
      <p>
        Dark Mode: <Switch checked={theme === "dark"} onChange={toggleTheme} />
      </p>

      {isAuthenticated ? (
        <>
          <p>User: {user!.username}</p>
          <Button
            onClick={async () => {
              setLoading(true);
              await logout();
              setLoading(false);
            }}
            loading={loading}
          >
            Logout
          </Button>
        </>
      ) : (
        <p>You are not logged in.</p>
      )}
    </BaseModule>
  );
};

export default Dashboard;
