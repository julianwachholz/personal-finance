import { SettingOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu, Typography } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";

const { Paragraph: P } = Typography;

const Dashboard = () => {
  const history = useHistory();
  const [t, i18n] = useTranslation();

  useTitle();
  return (
    <BaseModule
      title="Dashboard"
      rightContent={
        <SettingOutlined
          onClick={() => {
            history.push("/settings");
          }}
        />
      }
    >
      <P>{t("dashboard.todo")}</P>
      <Dropdown
        overlay={
          <Menu>
            <Menu.Item onClick={() => i18n.changeLanguage("de")}>de</Menu.Item>
            <Menu.Item onClick={() => i18n.changeLanguage("en")}>en</Menu.Item>
          </Menu>
        }
      >
        <Button>Lang</Button>
      </Dropdown>
    </BaseModule>
  );
};

export default Dashboard;
