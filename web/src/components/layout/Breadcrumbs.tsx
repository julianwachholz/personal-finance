import {
  HomeOutlined,
  LoadingOutlined,
  RightOutlined
} from "@ant-design/icons";
import { Breadcrumb } from "antd";
import React, { Suspense, useDeferredValue } from "react";
import { QueryResult, useIsFetching } from "react-query";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { useAccount } from "../../dao/accounts";
import { useCategory } from "../../dao/categories";
import { useTag } from "../../dao/tags";

type BreadcrumbFunc = (...args: string[]) => string;

type BreadcrumbMatch = [RegExp, string | BreadcrumbFunc];

const useLabel = ({ data }: QueryResult<any, any>): string => {
  return data?.label;
};

const breadcrumbs: BreadcrumbMatch[] = [
  [/^\/transactions\/?$/, "Transactions"],
  [/^\/reports\/?$/, "Reports"],

  [/^\/accounts\/?$/, "Accounts"],
  [/^\/accounts\/(\d+)\/?$/, pk => useLabel(useAccount(pk))],

  [/^\/budgets\/?$/, "Budgets"],
  [/^\/settings\/?$/, "Settings"],
  [/^\/settings\/categories\/?$/, "Categories"],
  [/^\/settings\/categories\/(\d+)\/?$/, pk => useLabel(useCategory(pk))],
  [/^\/settings\/tags\/?$/, "Tags"],
  [/^\/settings\/tags\/(\d+)\/?$/, pk => useLabel(useTag(pk))],

  [/\/create\/?$/, "Create"],
  [/\/edit\/?$/, "Edit"],
  [/\/delete\/?$/, "Delete"]
];

interface ICrumbProps {
  url: string;
  path: string;
  isLast?: boolean;
}

const Crumb: React.FC<ICrumbProps> = ({ url, path, isLast }) => {
  let name: string | undefined = undefined;
  const match = breadcrumbs.find(([r]) => r.test(url));
  if (match) {
    const groups = match[0].exec(url);
    if (groups) {
      groups.splice(0, 1);
      if (typeof match[1] === "function") {
        name = match[1](...groups);
      } else {
        name = match[1];
      }
    }
  }
  if (!name) {
    name = `${path[0].toUpperCase()}${path.substring(1)}`;
  }

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
        <Suspense fallback="...">
          <Crumb url={url} path={path} isLast={i === lastIndex} />
        </Suspense>
      </Breadcrumb.Item>
    );
  });

  const isFetching = useIsFetching();
  const spinning = useDeferredValue(isFetching, { timeoutMs: 200 });

  items.unshift(
    <Breadcrumb.Item key="/">
      <Link to="/">{spinning ? <LoadingOutlined /> : <HomeOutlined />}</Link>
    </Breadcrumb.Item>
  );

  return <Breadcrumb separator={<RightOutlined />}>{items}</Breadcrumb>;
};

export default Breadcrumbs;
