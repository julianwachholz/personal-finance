import {
  BankOutlined,
  FolderOutlined,
  HistoryOutlined,
  LineChartOutlined,
  PieChartOutlined,
  ProjectOutlined,
  SettingOutlined,
  ShopOutlined,
  TagsOutlined,
  ToolOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Menu } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { useSettings } from "../../utils/SettingsProvider";
import "./Menu.scss";

const { Item, SubMenu } = Menu;

interface MenuItem {
  path: string;
  icon: React.ReactElement;
  text: string;
  items?: MenuItem[];
}

const renderItem = (item: MenuItem) =>
  item.items ? (
    <SubMenu
      key={item.path}
      title={
        <>
          {item.icon}
          <span>{item.text}</span>
        </>
      }
    >
      {item.items.map(renderItem)}
    </SubMenu>
  ) : (
    <Item key={item.path}>
      <Link to={item.path}>
        {item.icon}
        <span>{item.text}</span>
      </Link>
    </Item>
  );

const MainMenu = () => {
  const { t } = useTranslation();
  const { theme, menuCollapsed } = useSettings();
  const { pathname } = useLocation();

  const subpaths = pathname.split("/").reduce<string[]>((acc, path) => {
    if (!path) return acc;
    acc.push(`${acc[acc.length - 1] ?? ""}/${path}`);
    return acc;
  }, []);

  const menuItems: MenuItem[] = [
    {
      path: "/",
      icon: <PieChartOutlined />,
      text: t("menu.dashboard")
    },
    {
      path: "/transactions",
      icon: <HistoryOutlined />,
      text: t("menu.transactions")
    },
    {
      path: "/budgets",
      icon: <ProjectOutlined rotate={180} />,
      text: t("menu.budgets")
    },
    {
      path: "/accounts",
      icon: <BankOutlined />,
      text: t("menu.accounts")
    },
    {
      path: "/reports",
      icon: <LineChartOutlined />,
      text: t("menu.reports")
    },
    {
      path: "/settings",
      icon: <SettingOutlined />,
      text: t("menu.settings"),
      items: [
        {
          path: "/settings/categories",
          icon: <FolderOutlined />,
          text: t("menu.categories")
        },
        {
          path: "/settings/tags",
          icon: <TagsOutlined />,
          text: t("menu.tags")
        },
        {
          path: "/settings/payees",
          icon: <ShopOutlined />,
          text: t("menu.payees")
        },
        {
          path: "/settings/preferences",
          icon: <ToolOutlined />,
          text: t("menu.preferences")
        },
        {
          path: "/settings/user",
          icon: <UserOutlined />,
          text: t("menu.profile")
        }
      ]
    }
  ];

  return (
    <Menu
      mode="inline"
      theme={theme}
      selectedKeys={subpaths.length ? subpaths : ["/"]}
      defaultOpenKeys={menuCollapsed ? undefined : subpaths}
    >
      {menuItems.map(renderItem)}
    </Menu>
  );
};

export default MainMenu;
