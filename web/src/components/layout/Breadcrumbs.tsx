import { HomeOutlined, RightOutlined, SyncOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { QueryResult, useIsFetching } from "react-query";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { useAccount } from "../../dao/accounts";
import { useBudget } from "../../dao/budgets";
import { useCategory } from "../../dao/categories";
import { usePayee } from "../../dao/payees";
import { useTag } from "../../dao/tags";
import useDebounce from "../../utils/debounce";
import "./Breadcrumbs.scss";

type BreadcrumbFunc = (...args: string[]) => string;

type BreadcrumbMatch = [RegExp, string | BreadcrumbFunc];

const useLabel = ({ data }: QueryResult<any, any>): string => {
  return data?.label || "...";
};

const breadcrumbs: BreadcrumbMatch[] = [
  [/^\/transactions\/?$/, "transactions"],
  [/^\/reports\/?$/, "reports"],

  [/^\/accounts\/?$/, "accounts"],
  [/^\/accounts\/(\d+)\/?$/, pk => useLabel(useAccount(pk))],

  [/^\/budgets\/?$/, "budgets"],
  [/^\/budgets\/(\d+)\/?$/, pk => useLabel(useBudget(pk))],
  [/^\/settings\/?$/, "settings"],
  [/^\/settings\/categories\/?$/, "categories"],
  [/^\/settings\/categories\/(\d+)\/?$/, pk => useLabel(useCategory(pk))],
  [/^\/settings\/tags\/?$/, "tags"],
  [/^\/settings\/tags\/(\d+)\/?$/, pk => useLabel(useTag(pk))],
  [/^\/settings\/payees\/?$/, "payees"],
  [/^\/settings\/payees\/(\d+)\/?$/, pk => useLabel(usePayee(pk))],
  [/^\/settings\/preferences\/?$/, "preferences"],
  [/^\/settings\/user\/?$/, "profile"],

  [/\/create\/?$/, "object_create"],
  [/\/edit\/?$/, "object_edit"],
  [/\/delete\/?$/, "object_delete"]
];

interface CrumbProps {
  url: string;
  path: string;
  isLast?: boolean;
}

const Crumb = ({ url, path, isLast }: CrumbProps) => {
  const [t, i18n] = useTranslation();

  const fixedCrumbs: any = useMemo(
    () => ({
      transactions: t("menu.transactions", "Transactions"),
      reports: t("menu.reports", "Reports"),
      accounts: t("menu.accounts", "Accounts"),
      budgets: t("menu.budgets", "Budgets"),
      settings: t("menu.settings", "Settings"),
      categories: t("menu.categories", "Categories"),
      tags: t("menu.tags", "Tags"),
      payees: t("menu.payees", "Payees"),
      preferences: t("menu.preferences", "Preferences"),
      profile: t("menu.profile", "Profile"),
      object_create: t("breadcrumb.object_create", "Create"),
      object_edit: t("breadcrumb.object_edit", "Edit"),
      object_delete: t("breadcrumb.object_delete", "Delete")
    }),
    // eslint-disable-next-line
    [i18n.language]
  );

  let name: string | undefined = undefined;
  const match = breadcrumbs.find(([r]) => r.test(url));
  if (match) {
    const groups = match[0].exec(url);
    if (groups) {
      groups.splice(0, 1);
      if (typeof match[1] === "function") {
        name = match[1](...groups);
      } else {
        name = fixedCrumbs[match[1]];
      }
    }
  }
  if (!name) {
    name = `${path[0].toUpperCase()}${path.substring(1)}`;
  }

  return isLast ? <span>{name}</span> : <Link to={url}>{name}</Link>;
};

const Breadcrumbs = () => {
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

  const isFetching = useIsFetching();
  const spinning = useDebounce(isFetching, 100);

  items.unshift(
    <Breadcrumb.Item key="/">
      <Link to="/">{spinning ? <SyncOutlined spin /> : <HomeOutlined />}</Link>
    </Breadcrumb.Item>
  );

  return <Breadcrumb separator={<RightOutlined />}>{items}</Breadcrumb>;
};

export default Breadcrumbs;
