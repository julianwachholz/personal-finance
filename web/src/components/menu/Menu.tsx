import { Icon, Menu } from "antd";
import React from "react";

const { Item, SubMenu } = Menu;

const MainMenu: React.FC = () => (
  <Menu mode="inline" theme="dark">
    <Item key="home">
      <Icon type="pie-chart" />
      <span>Dashboard</span>
    </Item>
    <Item key="transactions">
      <Icon type="history" />
      <span>Transactions</span>
    </Item>
    <Item key="reports">
      <Icon type="line-chart" />
      <span>Reports</span>
    </Item>
    <Item key="accounts">
      <Icon type="bank" />
      <span>Accounts</span>
    </Item>
    <Item key="budgets">
      <Icon type="project" rotate={180} />
      <span>Budgets</span>
    </Item>
    <SubMenu
      key="settings"
      title={
        <>
          <Icon type="setting" />
          <span>Settings</span>
        </>
      }
    >
      <Item key="settings.categories">
        <Icon type="folder" />
        <span>Categories</span>
      </Item>
      <Item key="settings.tags">
        <Icon type="tags" />
        <span>Tags</span>
      </Item>
      <Item key="settings.options">
        <Icon type="tool" />
        <span>Options</span>
      </Item>
      <Item key="settings.user">
        <Icon type="user" />
        <span>Profile</span>
      </Item>
    </SubMenu>
  </Menu>
);

export default MainMenu;
