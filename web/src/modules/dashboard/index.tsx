import { SettingOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";

const { Paragraph: P } = Typography;

const Dashboard = () => {
  const history = useHistory();
  const [t] = useTranslation();

  useTitle();
  return (
    <BaseModule
      title={t("dashboard.title", "Dashboard")}
      rightContent={
        <SettingOutlined
          onClick={() => {
            history.push("/settings");
          }}
        />
      }
    >
      <P>{t("dashboard.todo", "Placeholder")}</P>
    </BaseModule>
  );
};

export default Dashboard;
