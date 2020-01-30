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
    <BaseModule title={t("error.404.title", "Error 404")}>
      <Result
        status="404"
        title={t("error.404.message", "Not found")}
        subTitle={t(
          "error.404.description",
          'We looked everywhere but couldn\'t find a page for "{{ pathname }}".',
          {
            pathname: location.pathname
          }
        )}
        extra={
          <Link to="/">
            <Button type="primary">
              {t("error.404.go_to_dashboard", "Go to Dashboard")}
            </Button>
          </Link>
        }
      />
    </BaseModule>
  );
};

export default NotFound;
