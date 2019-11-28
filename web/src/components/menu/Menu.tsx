import { Icon, Menu } from "antd";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Menu.scss";

const { Item, SubMenu } = Menu;

interface IMenuItem {
  path: string;
  icon: string | React.ReactElement;
  text: string;
  items?: IMenuItem[];
}

const menuItems: IMenuItem[] = [
  {
    path: "/",
    icon: "pie-chart",
    text: "Dashboard"
  },
  {
    path: "/transactions",
    icon: "history",
    text: "Transactions"
  },
  {
    path: "/reports",
    icon: "line-chart",
    text: "Reports"
  },
  {
    path: "/accounts",
    icon: "bank",
    text: "Accounts"
  },
  {
    path: "/budgets",
    icon: <Icon type="project" rotate={180} />,
    text: "Budgets"
  },
  {
    path: "/settings",
    icon: "setting",
    text: "Settings",
    items: [
      {
        path: "/settings/categories",
        icon: "folder",
        text: "Categories"
      },
      {
        path: "/settings/tags",
        icon: "tags",
        text: "Tags"
      },
      {
        path: "/settings/options",
        icon: "tool",
        text: "Options"
      },
      {
        path: "/settings/user",
        icon: "user",
        text: "Profile"
      }
    ]
  }
];

const renderIcon = (icon: string | React.ReactElement) =>
  typeof icon === "string" ? <Icon type={icon} /> : icon;

const renderItem = (item: IMenuItem) =>
  item.items ? (
    <SubMenu
      key={item.path}
      title={
        <>
          {renderIcon(item.icon)}
          <span>{item.text}</span>
        </>
      }
    >
      {item.items.map(renderItem)}
    </SubMenu>
  ) : (
    <Item key={item.path}>
      <Link to={item.path}>
        {renderIcon(item.icon)}
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
