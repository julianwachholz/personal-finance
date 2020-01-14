import { LeftOutlined } from "@ant-design/icons";
import { PageHeader } from "antd";
import { ActivityIndicator, NavBar } from "antd-mobile";
import { PageHeaderProps } from "antd/lib/page-header";
import React from "react";
import { isMobile } from "react-device-detect";
import { useIsFetching } from "react-query";

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
  const isFetching = useIsFetching();

  if (isMobile) {
    return (
      <NavBar
        mode="dark"
        icon={onLeftClick ? leftIcon ?? <LeftOutlined /> : undefined}
        onLeftClick={e => {
          e.stopPropagation();
          onLeftClick?.();
        }}
        rightContent={
          rightContent ?? (isFetching ? <ActivityIndicator /> : undefined)
        }
        onClick={props.onClick}
      >
        <div>{props.title}</div>
      </NavBar>
    );
  }
  return <PageHeader {...props} />;
};

export default AppHeader;
