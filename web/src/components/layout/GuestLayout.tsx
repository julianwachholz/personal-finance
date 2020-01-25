import { GlobalOutlined } from "@ant-design/icons";
import { Button, Dropdown, Layout, Menu } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { APP_TITLE } from "../../utils/constants";
import "./GuestLayout.scss";
import Logo from "./Logo";

const { Content } = Layout;

export const GuestLayout: React.FC = ({ children }) => {
  const { i18n } = useTranslation(undefined, { useSuspense: false });
  return (
    <Layout>
      <Link className="brand-logo" to="/" style={{ color: "rgba(0,0,0,0.65)" }}>
        <Logo />
        <h1>{APP_TITLE}</h1>
      </Link>
      <Content>{children}</Content>
      <Dropdown
        className="language-select"
        overlay={
          <Menu className="language-select-menu" selectedKeys={[i18n.language]}>
            <Menu.Item key="en" onClick={() => i18n.changeLanguage("en")}>
              English
            </Menu.Item>
            <Menu.Item key="de" onClick={() => i18n.changeLanguage("de")}>
              Deutsch
            </Menu.Item>
          </Menu>
        }
      >
        <Button>
          <GlobalOutlined /> Language
        </Button>
      </Dropdown>
    </Layout>
  );
};

export default GuestLayout;
