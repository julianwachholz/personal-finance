import { SettingOutlined } from "@ant-design/icons";
import { Alert, Typography } from "antd";
import React, { useState } from "react";
import { MobileView } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { RouteComponentProps } from "react-router";
import { useAuth } from "../../utils/AuthProvider";
import { useSettings } from "../../utils/SettingsProvider";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";
import OnboardingWizard from "./OnboardingWizard";

const { Paragraph: P } = Typography;

const Dashboard = ({ history }: RouteComponentProps) => {
  const { settings } = useAuth();
  const [t] = useTranslation();
  const { updateApp } = useSettings();
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
      <MobileView>
        {updateApp ? (
          <Alert
            message={t("pwa.update_available", "A new version is available.")}
            showIcon
            closeText={t("pwa.update_now", "Update Now")}
          />
        ) : null}
      </MobileView>
      <P>{t("dashboard.todo", "Placeholder")}</P>
      <P>Updated content bla.</P>
      <OnboardingWizard
        visible={onboardingVisible}
        onVisible={setOnboardingVisible}
      />
    </BaseModule>
  );
};

export default Dashboard;
