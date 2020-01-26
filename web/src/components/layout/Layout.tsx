import { LoadingOutlined } from "@ant-design/icons";
import { Layout, Spin } from "antd";
import React, { Suspense } from "react";
import { Link } from "react-router-dom";
import { APP_TITLE } from "../../utils/constants";
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
          <span>{APP_TITLE}</span>
        </Link>
        <Suspense fallback={<Spin indicator={<LoadingOutlined />} />}>
          <MainMenu />
        </Suspense>
      </Sider>
      <Layout>
        <Content>
          <Suspense fallback={<Spin indicator={<LoadingOutlined />} />}>
            <Breadcrumbs />
          </Suspense>
          <div className="content-container">{children}</div>
        </Content>
        <Footer>🧇 ©{new Date().getFullYear()}</Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
