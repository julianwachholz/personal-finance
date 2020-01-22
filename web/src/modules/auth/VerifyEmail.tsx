import { LoadingOutlined } from "@ant-design/icons";
import { Alert, Spin } from "antd";
import React, { useEffect, useState } from "react";
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

  useTitle(`Email Verification`);
  return (
    <div>
      <h2>Email Verification</h2>
      <div style={{ textAlign: "center" }}>
        {verifying && (
          <Spin
            size="large"
            tip="Verifying..."
            indicator={<LoadingOutlined />}
          />
        )}
      </div>
      {error && <Alert type="error" message={error ?? "An error occured"} />}
    </div>
  );
};

export default VerifyEmail;
