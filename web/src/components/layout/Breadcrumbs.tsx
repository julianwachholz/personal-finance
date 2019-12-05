import { Breadcrumb, Icon } from "antd";
import React from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

type BreadcrumbMatch = [RegExp, any];

const breadcrumbs: BreadcrumbMatch[] = [
  [/^\/accounts\/?$/, "$Accounts"],
  [/^\/accounts\/(\d+)\/?$/, "$Account"],
  [/^\/settings\/categories\/(\d+)\/?$/, "$Category"],
  [/^\/settings\/tags\/(\d+)\/?$/, "$Tag"]
];

const itemName = (url: string, path: string) => {
  const match = breadcrumbs.find(([r]) => r.exec(url));
  if (match) {
    console.info(match);
    const [, name] = match;
    return name;
  }
  return `${path[0].toUpperCase()}${path.substring(1)}`;
};

interface ICrumbProps {
  url: string;
  path: string;
  isLast?: boolean;
}

const Crumb: React.FC<ICrumbProps> = ({ url, path, isLast }) => {
  const name = itemName(url, path);
  return isLast ? <span>{name}</span> : <Link to={url}>{name}</Link>;
};

const Breadcrumbs: React.FC = () => {
  const { pathname } = useLocation();
  const subpaths = pathname.split("/").filter(Boolean);
  const lastIndex = subpaths.length - 1;

  const items = subpaths.map((path, i) => {
    const url = `/${subpaths.slice(0, i + 1).join("/")}`;
    return (
      <Breadcrumb.Item key={url}>
        <Crumb url={url} path={path} isLast={i === lastIndex} />
      </Breadcrumb.Item>
    );
  });

  items.unshift(
    <Breadcrumb.Item key="/">
      <Link to="/">
        <Icon type="home" />
      </Link>
    </Breadcrumb.Item>
  );

  return <Breadcrumb separator={<Icon type="right" />}>{items}</Breadcrumb>;
};

export default Breadcrumbs;
