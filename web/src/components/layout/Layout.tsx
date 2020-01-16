import { Layout } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { useSettings } from "../../utils/SettingsProvider";
import MainMenu from "../menu/Menu";
import Breadcrumbs from "./Breadcrumbs";
import "./Layout.scss";
import Logo from "./Logo";

const { Sider, Content, Footer } = Layout;

const AppLayout: React.FC = ({ children }) => {
  const { theme, menuCollapsed, toggleMenu } = useSettings();
  return (
    <Layout>
      <Sider
        collapsible
        collapsed={menuCollapsed}
        onCollapse={toggleMenu}
        theme={theme}
      >
        <Link to="/" className="app-title">
          <Logo />
          <span>ShinyWaffle</span>
        </Link>
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
