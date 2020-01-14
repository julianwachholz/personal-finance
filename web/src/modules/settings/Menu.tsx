import {
  FolderOutlined,
  ShopOutlined,
  TagsOutlined,
  ToolOutlined,
  UserOutlined
} from "@ant-design/icons";
import { List } from "antd-mobile";
import React from "react";
import { isMobile } from "react-device-detect";
import { Redirect, useHistory } from "react-router";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";

const SettingsMenu = () => {
  const history = useHistory();

  useTitle("Settings");
  if (!isMobile) {
    return <Redirect to="/settings/preferences" />;
  }
  return (
    <BaseModule
      title="Settings"
      onLeftClick={() => {
        history.go(-1);
      }}
    >
      <List renderHeader="Settings">
        <List.Item
          thumb={<FolderOutlined />}
          arrow="horizontal"
          onClick={() => history.push("/settings/categories")}
        >
          Categories
        </List.Item>
        <List.Item
          thumb={<TagsOutlined />}
          arrow="horizontal"
          onClick={() => history.push("/settings/tags")}
        >
          Tags
        </List.Item>
        <List.Item
          thumb={<ShopOutlined />}
          arrow="horizontal"
          onClick={() => history.push("/settings/payees")}
        >
          Payees
        </List.Item>
        <List.Item
          thumb={<ToolOutlined />}
          arrow="horizontal"
          onClick={() => history.push("/settings/preferences")}
        >
          Preferences
        </List.Item>
        <List.Item
          thumb={<UserOutlined />}
          arrow="horizontal"
          onClick={() => history.push("/settings/user")}
        >
          Profile
        </List.Item>
      </List>
    </BaseModule>
  );
};

export default SettingsMenu;
