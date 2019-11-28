import { Breadcrumb, Icon } from "antd";
import React from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

const { Item } = Breadcrumb;

const Breadcrumbs: React.FC = () => {
  const { pathname } = useLocation();
  const subpaths = pathname.split("/").filter(Boolean);

  const items = subpaths.map((path, i) => {
    const url = `/${subpaths.slice(0, i + 1).join("/")}`;
    if (i === subpaths.length - 1) {
      return <Item key={url}>{path}</Item>;
    }
    return (
      <Item key={url}>
        <Link to={url}>{path}</Link>
      </Item>
    );
  });
  items.unshift(
    <Item key="/">
      <Link to="/">
        <Icon type="home" />
      </Link>
    </Item>
  );

  return <Breadcrumb separator={<Icon type="right" />}>{items}</Breadcrumb>;
};

export default Breadcrumbs;
