import { Button, Result } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link, RouteComponentProps } from "react-router-dom";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";

const NotFound = ({ location }: RouteComponentProps) => {
  const [t] = useTranslation();

  useTitle(t("error.404.title"));
  return (
    <BaseModule title={t("error.404.title")}>
      <Result
        status="404"
        title={t("error.404.message")}
        subTitle={t("error.404.description", {
          pathname: location.pathname
        })}
        extra={
          <Link to="/">
            <Button type="primary">{t("error.404.go_to_dashboard")}</Button>
          </Link>
        }
      />
    </BaseModule>
  );
};

export default NotFound;
