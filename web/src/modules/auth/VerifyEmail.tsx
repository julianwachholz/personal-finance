import { LoadingOutlined } from "@ant-design/icons";
import { Alert, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { RouteComponentProps } from "react-router";
import { postVerifyEmail } from "../../dao/user";
import useTitle from "../../utils/useTitle";

interface VerifyEmailRouteParams {
  token: string;
}

const VerifyEmail = ({
  history,
  match
}: RouteComponentProps<VerifyEmailRouteParams>) => {
  const [t] = useTranslation("auth");
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState();
  const [verify] = useMutation(postVerifyEmail);

  useEffect(() => {
    verify(match.params)
      .then(({ username }) => {
        history.replace(`/`, { verified: true, username });
      })
      .catch(e => {
        setError(e.error);
      })
      .finally(() => {
        setVerifying(false);
      });
    // eslint-disable-next-line
  }, []);

  useTitle(t("auth:verify.title", "Email verification"));
  return (
    <div>
      <h2>{t("auth:verify.title", "Email verification")}</h2>
      <div style={{ textAlign: "center" }}>
        {verifying && (
          <Spin
            size="large"
            tip={t("auth:verify.loading", "Verifying...")}
            indicator={<LoadingOutlined />}
          />
        )}
      </div>
      {error && (
        <Alert
          type="error"
          message={error ?? t("auth:verify.error", "An error occured")}
        />
      )}
    </div>
  );
};

export default VerifyEmail;
