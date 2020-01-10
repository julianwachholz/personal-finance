import {
  BankOutlined,
  FolderOutlined,
  HistoryOutlined,
  LineChartOutlined,
  PieChartOutlined,
  ProjectOutlined,
  SettingOutlined,
  TagOutlined,
  ToolOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Menu } from "antd";
import React from "react";
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

const menuItems: MenuItem[] = [
  {
    path: "/",
    icon: <PieChartOutlined />,
    text: "Dashboard"
  },
  {
    path: "/transactions",
    icon: <HistoryOutlined />,
    text: "Transactions"
  },
  {
    path: "/reports",
    icon: <LineChartOutlined />,
    text: "Reports"
  },
  {
    path: "/accounts",
    icon: <BankOutlined />,
    text: "Accounts"
  },
  {
    path: "/budgets",
    icon: <ProjectOutlined rotate={180} />,
    text: "Budgets"
  },
  {
    path: "/settings",
    icon: <SettingOutlined />,
    text: "Settings",
    items: [
      {
        path: "/settings/categories",
        icon: <FolderOutlined />,
        text: "Categories"
      },
      {
        path: "/settings/tags",
        icon: <TagOutlined />,
        text: "Tags"
      },
      {
        path: "/settings/payees",
        icon: <TagOutlined />,
        text: "Payees"
      },
      {
        path: "/settings/preferences",
        icon: <ToolOutlined />,
        text: "Preferences"
      },
      {
        path: "/settings/user",
        icon: <UserOutlined />,
        text: "Profile"
      }
    ]
  }
];

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
  const { theme, menuCollapsed } = useSettings();
  const { pathname } = useLocation();

  const subpaths = pathname.split("/").reduce<string[]>((acc, path) => {
    if (!path) return acc;
    acc.push(`${acc[acc.length - 1] ?? ""}/${path}`);
    return acc;
  }, []);

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
