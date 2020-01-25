import { Layout, Select } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { APP_TITLE } from "../../utils/constants";
import "./GuestLayout.scss";
import Logo from "./Logo";

const { Content } = Layout;

export const GuestLayout: React.FC = ({ children }) => {
  const { i18n } = useTranslation();
  return (
    <Layout>
      <Link className="brand-logo" to="/" style={{ color: "rgba(0,0,0,0.65)" }}>
        <Logo />
        <h1>{APP_TITLE}</h1>
      </Link>
      <Content>{children}</Content>
      <Select
        className="language-select"
        onChange={lang => i18n.changeLanguage(lang as string)}
        defaultValue={i18n.language}
      >
        <Select.Option value="en">English</Select.Option>
        <Select.Option value="de">Deutsch</Select.Option>
      </Select>
    </Layout>
  );
};

export default GuestLayout;
