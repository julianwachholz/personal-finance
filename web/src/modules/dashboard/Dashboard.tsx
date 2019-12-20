import { Switch } from "antd";
import React from "react";
import { useSettings } from "../../utils/SettingsProvider";
import BaseModule from "../base/BaseModule";

const Dashboard: React.FC = () => {
  const { theme, toggleTheme } = useSettings();

  return (
    <BaseModule title="Dashboard">
      <p>
        Dark Mode: <Switch checked={theme === "dark"} onChange={toggleTheme} />
      </p>
    </BaseModule>
  );
};

export default Dashboard;
