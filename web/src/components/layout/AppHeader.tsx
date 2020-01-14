import { LeftOutlined } from "@ant-design/icons";
import { PageHeader } from "antd";
import { NavBar } from "antd-mobile";
import { PageHeaderProps } from "antd/lib/page-header";
import React from "react";
import { isMobile } from "react-device-detect";

export interface AppHeaderProps extends PageHeaderProps {
  onClick?: () => void;
  onLeftClick?: () => void;
  leftIcon?: React.ReactElement;
  rightContent?: React.ReactElement;
}

const AppHeader = ({
  onLeftClick,
  leftIcon,
  rightContent,
  ...props
}: AppHeaderProps) => {
  if (isMobile) {
    return (
      <NavBar
        mode="dark"
        icon={onLeftClick ? leftIcon ?? <LeftOutlined /> : undefined}
        onLeftClick={e => {
          e.stopPropagation();
          onLeftClick?.();
        }}
        rightContent={rightContent}
        onClick={props.onClick}
      >
        <div>{props.title}</div>
      </NavBar>
    );
  }
  return <PageHeader {...props} />;
};

export default AppHeader;
