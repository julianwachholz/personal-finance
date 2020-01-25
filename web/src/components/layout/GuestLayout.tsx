import { Layout } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { APP_TITLE } from "../../utils/constants";
import "./GuestLayout.scss";
import Logo from "./Logo";

const { Content } = Layout;

export const GuestLayout: React.FC = ({ children }) => {
  return (
    <Layout>
      <Link className="brand-logo" to="/" style={{ color: "rgba(0,0,0,0.65)" }}>
        <Logo />
        <h1>{APP_TITLE}</h1>
      </Link>
      <Content>{children}</Content>
    </Layout>
  );
};

export default GuestLayout;
