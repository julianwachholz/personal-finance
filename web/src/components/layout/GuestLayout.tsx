import { Layout } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { APP_TITLE } from "../../utils/constants";
import LanguageMenu from "../form/LanguageMenu";
import "./GuestLayout.scss";
import Logo from "./Logo";

const { Content } = Layout;

export const GuestLayout: React.FC = ({ children }) => {
  const [t, i18n] = useTranslation("translation", { useSuspense: false });
  return (
    <Layout>
      <Link className="brand-logo" to="/" style={{ color: "rgba(0,0,0,0.65)" }}>
        <Logo />
        <h1>{APP_TITLE}</h1>
      </Link>
      <Content>{children}</Content>
      <LanguageMenu />
    </Layout>
  );
};

export default GuestLayout;
