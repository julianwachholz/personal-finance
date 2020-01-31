import { SettingOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { RouteComponentProps } from "react-router";
import { useAuth } from "../../utils/AuthProvider";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";
import OnboardingWizard from "./OnboardingWizard";

const { Paragraph: P } = Typography;

const Dashboard = ({ history }: RouteComponentProps) => {
  const { settings } = useAuth();
  const [t] = useTranslation();
  const [onboardingVisible, setOnboardingVisible] = useState(
    !settings?.default_currency
  );

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
      <OnboardingWizard
        visible={onboardingVisible}
        onVisible={setOnboardingVisible}
      />
    </BaseModule>
  );
};

export default Dashboard;
