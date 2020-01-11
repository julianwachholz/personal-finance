import { LeftOutlined, MenuOutlined } from "@ant-design/icons";
import { PageHeader } from "antd";
import { NavBar } from "antd-mobile";
import { PageHeaderProps } from "antd/lib/page-header";
import React from "react";
import { isMobile } from "react-device-detect";
import { useSettings } from "../../utils/SettingsProvider";

interface AppHeaderProps extends PageHeaderProps {
  onClick?: () => void;
}

const AppHeader = (props: AppHeaderProps) => {
  const { theme } = useSettings();
  if (isMobile) {
    return (
      <NavBar
        mode={theme}
        icon={<LeftOutlined />}
        onLeftClick={e => {
          e.stopPropagation();
          console.log("NavBar left click");
        }}
        rightContent={<MenuOutlined />}
        onClick={props.onClick}
      >
        <div>{props.title}</div>
      </NavBar>
    );
  }
  return <PageHeader {...props} />;
};

export default AppHeader;
