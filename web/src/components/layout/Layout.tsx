import { Layout } from "antd";
import React from "react";
import MainMenu from "../menu/Menu";

const { Header, Sider, Content, Footer } = Layout;

const AppLayout: React.FC = () => (
  <Layout>
    <Sider collapsible>
      <MainMenu />
    </Sider>
    <Layout>
      <Header>Header</Header>
      <Content>Content</Content>
      <Footer>Footer</Footer>
    </Layout>
  </Layout>
);

export default AppLayout;
