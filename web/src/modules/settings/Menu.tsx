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
import { useTranslation } from "react-i18next";
import { Redirect, useHistory } from "react-router";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";

const SettingsMenu = () => {
  const [t] = useTranslation();
  const history = useHistory();

  useTitle(t("menu.settings"));
  if (!isMobile) {
    return <Redirect to="/settings/preferences" />;
  }
  return (
    <BaseModule
      title={t("menu.settings")}
      className="module module-list"
      onLeftClick={() => {
        history.go(-1);
      }}
    >
      <List>
        <List.Item
          thumb={<FolderOutlined />}
          arrow="horizontal"
          onClick={() => history.push("/settings/categories")}
        >
          {t("menu.categories")}
        </List.Item>
        <List.Item
          thumb={<TagsOutlined />}
          arrow="horizontal"
          onClick={() => history.push("/settings/tags")}
        >
          {t("menu.tags")}
        </List.Item>
        <List.Item
          thumb={<ShopOutlined />}
          arrow="horizontal"
          onClick={() => history.push("/settings/payees")}
        >
          {t("menu.payees")}
        </List.Item>
        <List.Item
          thumb={<ToolOutlined />}
          arrow="horizontal"
          onClick={() => history.push("/settings/preferences")}
        >
          {t("menu.preferences")}
        </List.Item>
        <List.Item
          thumb={<UserOutlined />}
          arrow="horizontal"
          onClick={() => history.push("/settings/user")}
        >
          {t("menu.profile")}
        </List.Item>
      </List>
    </BaseModule>
  );
};

export default SettingsMenu;
