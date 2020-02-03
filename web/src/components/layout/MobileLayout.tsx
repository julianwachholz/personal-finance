import {
  BankOutlined,
  HistoryOutlined,
  PieChartOutlined,
  ProjectOutlined
} from "@ant-design/icons";
import { Badge, Layout } from "antd";
import { TabBar } from "antd-mobile";
import "antd-mobile/dist/antd-mobile.css";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router";
import { useSettings } from "../../utils/SettingsProvider";
import "./MobileLayout.scss";

const { Content } = Layout;

const MobileLayout: React.FC = ({ children }) => {
  const [t] = useTranslation("translation", { useSuspense: false });
  const history = useHistory();
  const { pathname } = useLocation();
  const { updateApp } = useSettings();

  return (
    <Layout>
      <Content className="content-container">{children}</Content>
      <TabBar>
        <TabBar.Item
          title={t("menu.transactions", "Transactions")}
          icon={<HistoryOutlined />}
          selectedIcon={<HistoryOutlined />}
          selected={pathname.startsWith(`/transactions`)}
          onPress={() => {
            history.push(`/transactions`);
          }}
        />
        <TabBar.Item
          title={t("menu.accounts", "Accounts")}
          icon={<BankOutlined />}
          selectedIcon={<BankOutlined />}
          selected={pathname.startsWith(`/accounts`)}
          onPress={() => {
            history.push(`/accounts`);
          }}
        />
        <TabBar.Item
          title={t("menu.dashboard", "Dashboard")}
          icon={
            <Badge dot count={updateApp ? 1 : 0}>
              <PieChartOutlined />
            </Badge>
          }
          selectedIcon={
            <Badge dot count={updateApp ? 1 : 0}>
              <PieChartOutlined />
            </Badge>
          }
          selected={pathname === `/`}
          onPress={() => {
            history.push(`/`);
          }}
        />
        <TabBar.Item
          title={t("menu.budgets", "Budgets")}
          icon={<ProjectOutlined rotate={180} />}
          selectedIcon={<ProjectOutlined rotate={180} />}
          selected={pathname.startsWith(`/budgets`)}
          onPress={() => {
            history.push(`/budgets`);
          }}
        />
      </TabBar>
    </Layout>
  );
};

export default MobileLayout;
