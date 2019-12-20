import { Layout } from "antd";
import React from "react";
import { useSettings } from "../../utils/SettingsProvider";
import MainMenu from "../menu/Menu";
import Breadcrumbs from "./Breadcrumbs";
import "./Layout.scss";

const { Sider, Content, Footer } = Layout;

const AppLayout: React.FC = props => {
  const { theme } = useSettings();
  return (
    <Layout className={`app--${theme}`}>
      <Sider collapsible theme={theme}>
        <MainMenu />
      </Sider>
      <Layout>
        <Content>
          <Breadcrumbs />
          <div className="content-container">{props.children}</div>
        </Content>
        <Footer>🧇 ©{new Date().getFullYear()}</Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
