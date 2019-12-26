import { Layout } from "antd";
import React from "react";
import { useSettings } from "../../utils/SettingsProvider";
import MainMenu from "../menu/Menu";
import Breadcrumbs from "./Breadcrumbs";
import "./Layout.scss";

const { Sider, Content, Footer } = Layout;

const AppLayout: React.FC = ({ children }) => {
  const { theme, menuCollapsed, toggleMenu } = useSettings();
  return (
    <Layout className={`app--${theme}`}>
      <Sider
        collapsible
        collapsed={menuCollapsed}
        onCollapse={toggleMenu}
        theme={theme}
      >
        <MainMenu />
      </Sider>
      <Layout>
        <Content>
          <Breadcrumbs />
          <div className="content-container">{children}</div>
        </Content>
        <Footer>🧇 ©{new Date().getFullYear()}</Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
