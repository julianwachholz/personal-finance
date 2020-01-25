import {
  BankOutlined,
  HistoryOutlined,
  PieChartOutlined,
  ProjectOutlined
} from "@ant-design/icons";
import { Layout } from "antd";
import { TabBar } from "antd-mobile";
import "antd-mobile/dist/antd-mobile.css";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router";
import "./MobileLayout.scss";

const { Content } = Layout;

const MobileLayout: React.FC = ({ children }) => {
  const [t] = useTranslation();
  const history = useHistory();
  const { pathname } = useLocation();

  return (
    <Layout>
      <Content className="content-container">{children}</Content>
      <TabBar>
        <TabBar.Item
          title={t("menu.transactions")}
          icon={<HistoryOutlined />}
          selectedIcon={<HistoryOutlined />}
          selected={pathname.startsWith(`/transactions`)}
          onPress={() => {
            history.push(`/transactions`);
          }}
        />
        <TabBar.Item
          title={t("menu.accounts")}
          icon={<BankOutlined />}
          selectedIcon={<BankOutlined />}
          selected={pathname.startsWith(`/accounts`)}
          onPress={() => {
            history.push(`/accounts`);
          }}
        />
        <TabBar.Item
          title={t("menu.dashboard")}
          icon={<PieChartOutlined />}
          selectedIcon={<PieChartOutlined />}
          selected={pathname === `/`}
          onPress={() => {
            history.push(`/`);
          }}
        />
        <TabBar.Item
          title={t("menu.budgets")}
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
