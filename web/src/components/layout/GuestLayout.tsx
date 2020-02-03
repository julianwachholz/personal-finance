import { Button, Layout } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { APP_TITLE } from "../../utils/constants";
import { useSettings } from "../../utils/SettingsProvider";
import LanguageMenu from "../form/LanguageMenu";
import "./GuestLayout.scss";
import Logo from "./Logo";

const { Content } = Layout;

export const GuestLayout: React.FC = ({ children }) => {
  const { updateApp } = useSettings();
  return (
    <Layout>
      <Link className="brand-logo" to="/" style={{ color: "rgba(0,0,0,0.65)" }}>
        <Logo />
        <h1>{APP_TITLE}</h1>
      </Link>
      <Content>{children}</Content>
      <LanguageMenu />
      {updateApp ? (
        <Button type="primary" onClick={updateApp}>
          UPDATE
        </Button>
      ) : null}
    </Layout>
  );
};

export default GuestLayout;
