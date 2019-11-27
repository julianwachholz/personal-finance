import { Breadcrumb, Layout } from "antd";
import React from "react";
import MainMenu from "../menu/Menu";
import "./Layout.scss";

const { Sider, Content, Footer } = Layout;

const AppLayout: React.FC = props => (
  <Layout>
    <Sider collapsible>
      <MainMenu />
    </Sider>
    <Layout>
      <Content>
        <Breadcrumb>
          <Breadcrumb.Item>Transactions</Breadcrumb.Item>
          <Breadcrumb.Item>Detail</Breadcrumb.Item>
        </Breadcrumb>
        <div className="content-container">{props.children}</div>
      </Content>
      <Footer>🧇 ©{new Date().getFullYear()}</Footer>
    </Layout>
  </Layout>
);

export default AppLayout;
