import { Switch, Typography } from "antd";
import React from "react";
import { RouteComponentProps } from "react-router";
import { useSettings } from "../../utils/SettingsProvider";
import BaseModule from "../base/BaseModule";

const { Paragraph: P } = Typography;

const Options: React.FC<RouteComponentProps> = () => {
  const { theme, toggleTheme } = useSettings();
  return (
    <BaseModule title="Options">
      <P>
        Dark Mode: <Switch checked={theme === "dark"} onChange={toggleTheme} />
      </P>
    </BaseModule>
  );
};

export default Options;
