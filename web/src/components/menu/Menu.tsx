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
import "./Menu.scss";

const { Item, SubMenu } = Menu;

interface IMenuItem {
  path: string;
  icon: React.ReactElement;
  text: string;
  items?: IMenuItem[];
}

const menuItems: IMenuItem[] = [
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
        path: "/settings/options",
        icon: <ToolOutlined />,
        text: "Options"
      },
      {
        path: "/settings/user",
        icon: <UserOutlined />,
        text: "Profile"
      }
    ]
  }
];

const renderItem = (item: IMenuItem) =>
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

const MainMenu: React.FC = () => {
  const { pathname } = useLocation();
  const subpaths = pathname.split("/").map(p => `/${p}`);

  return (
    <Menu
      mode="inline"
      theme="light"
      selectedKeys={[pathname]}
      defaultOpenKeys={subpaths}
    >
      {menuItems.map(renderItem)}
    </Menu>
  );
};

export default MainMenu;
