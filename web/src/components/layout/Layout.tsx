import { Layout, Spin } from "antd";
import React, { Suspense } from "react";
import MainMenu from "../menu/Menu";
import Breadcrumbs from "./Breadcrumbs";
import "./Layout.scss";

const { Sider, Content, Footer } = Layout;

const AppLayout: React.FC = props => (
  <Layout>
    <Sider collapsible theme="light">
      <MainMenu />
    </Sider>
    <Layout>
      <Content>
        <Breadcrumbs />
        <div className="content-container">
          <Suspense fallback={<Spin tip="Loading..." />}>
            {props.children}
          </Suspense>
        </div>
      </Content>
      <Footer>🧇 ©{new Date().getFullYear()}</Footer>
    </Layout>
  </Layout>
);

export default AppLayout;
