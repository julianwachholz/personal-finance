import { Layout } from "antd";
import React from "react";
import "./GuestLayout.scss";
import Logo from "./Logo";

const { Content } = Layout;

export const GuestLayout: React.FC = ({ children }) => {
  return (
    <Layout>
      <div className="brand-logo">
        <Logo />
        <h1>ShinyWaffle</h1>
      </div>
      <Content>{children}</Content>
    </Layout>
  );
};

export default GuestLayout;
