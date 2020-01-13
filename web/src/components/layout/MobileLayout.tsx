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
import { useHistory, useLocation } from "react-router";
import "./MobileLayout.scss";

const { Content } = Layout;

const MobileLayout: React.FC = ({ children }) => {
  const history = useHistory();
  const { pathname } = useLocation();

  return (
    <Layout>
      <Content className="content-container">{children}</Content>
      <TabBar>
        <TabBar.Item
          title="Transactions"
          icon={<HistoryOutlined />}
          selectedIcon={<HistoryOutlined />}
          selected={pathname.startsWith(`/transactions`)}
          onPress={() => {
            history.push(`/transactions`);
          }}
        />
        <TabBar.Item
          title="Accounts"
          icon={<BankOutlined />}
          selectedIcon={<BankOutlined />}
          selected={pathname.startsWith(`/accounts`)}
          onPress={() => {
            history.push(`/accounts`);
          }}
        />
        <TabBar.Item
          title="Dashboard"
          icon={<PieChartOutlined />}
          selectedIcon={<PieChartOutlined />}
          selected={pathname === `/`}
          onPress={() => {
            history.push(`/`);
          }}
        />
        <TabBar.Item
          title="Budgets"
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
