import { LeftOutlined, MenuOutlined } from "@ant-design/icons";
import { PageHeader } from "antd";
import { NavBar } from "antd-mobile";
import { PageHeaderProps } from "antd/lib/page-header";
import React from "react";
import { isMobile } from "react-device-detect";
import { useSettings } from "../../utils/SettingsProvider";

export interface AppHeaderProps extends PageHeaderProps {
  onClick?: () => void;
  onLeftClick?: () => void;
  leftIcon?: React.ReactElement;
}

const AppHeader = ({ onLeftClick, leftIcon, ...props }: AppHeaderProps) => {
  const { theme } = useSettings();
  if (isMobile) {
    return (
      <NavBar
        mode={theme}
        icon={onLeftClick ? leftIcon ?? <LeftOutlined /> : undefined}
        onLeftClick={e => {
          e.stopPropagation();
          onLeftClick?.();
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
