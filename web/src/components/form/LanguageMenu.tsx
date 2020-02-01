import { GlobalOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

interface LanguageMenuProps {
  label?: string;
  onChange?: (language: string) => void;
}

export const LanguageMenu = ({ label, onChange }: LanguageMenuProps) => {
  const [t, i18n] = useTranslation("translation", {
    useSuspense: false
  });

  const onClick = (language: string) => {
    i18n.changeLanguage(language);
    onChange?.(language);
  };

  return (
    <Dropdown
      className="language-select"
      overlay={
        <Menu className="language-select-menu" selectedKeys={[i18n.language]}>
          <Menu.Item key="en" onClick={() => onClick("en")}>
            English
          </Menu.Item>
          <Menu.Item key="de" onClick={() => onClick("de")}>
            Deutsch
          </Menu.Item>
          <Menu.Item key="pl" onClick={() => onClick("pl")}>
            Polski
          </Menu.Item>
        </Menu>
      }
    >
      <Button>
        <GlobalOutlined /> {label ?? t("language", "Language")}
      </Button>
    </Dropdown>
  );
};

export default LanguageMenu;
