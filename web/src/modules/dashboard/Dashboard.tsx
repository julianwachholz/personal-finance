import { Switch } from "antd";
import React from "react";
import { useAuth } from "../../utils/AuthProvider";
import { useSettings } from "../../utils/SettingsProvider";
import BaseModule from "../base/BaseModule";

const Dashboard: React.FC = () => {
  const { theme, toggleTheme } = useSettings();
  const { isAuthenticated, user } = useAuth();

  return (
    <BaseModule title="Dashboard">
      <p>
        Dark Mode: <Switch checked={theme === "dark"} onChange={toggleTheme} />
      </p>

      {isAuthenticated ? (
        <p>User: {user!.username}</p>
      ) : (
        <p>You are not logged in.</p>
      )}
    </BaseModule>
  );
};

export default Dashboard;
