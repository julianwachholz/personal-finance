import { LockOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { RouteComponentProps } from "react-router";
import { postResetPassword } from "../../dao/user";
import { applyFormErrors } from "../../utils/errors";
import useTitle from "../../utils/useTitle";

interface ResetPasswordRouteParams {
  token: string;
}

interface ResetPasswordLocationState {
  token?: string;
  resetPassword?: true;
}

const ResetPassword = ({
  match,
  history,
  location
}: RouteComponentProps<
  ResetPasswordRouteParams,
  {},
  ResetPasswordLocationState
>) => {
  const [t] = useTranslation("auth");
  const [form] = Form.useForm();
  const [validating, setValidating] = useState(false);
  const [resetPassword] = useMutation(postResetPassword);

  useEffect(() => {
    // remove token from url to prevent accidental sharing
    history.replace(`/reset-password`, { token: match.params.token });
    // eslint-disable-next-line
  }, []);

  const onSubmit = async ({ new_password }: { new_password: string }) => {
    if (!location.state?.token) {
      return;
    }
    setValidating(true);
    try {
      await resetPassword({ new_password, token: location.state.token });
      history.replace(`/`, { resetPassword: true });
    } catch (error) {
      applyFormErrors(form, error);
    }
    setValidating(false);
  };

  useTitle(t("auth:reset_password.title", "Reset password"));
  return (
    <Form
      form={form}
      onFinish={data => onSubmit(data as any)}
      layout="vertical"
    >
      <h2>{t("auth:reset_password.title", "Reset password")}</h2>
      <Form.Item
        name="new_password"
        label={t("auth:reset_password.form.new_password", "New password")}
        rules={[
          {
            required: true,
            message: t(
              "auth:reset_password.form.new_password_required",
              "Please choose a new password"
            )
          }
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder={t(
            "auth:reset_password.form.new_password",
            "Make it extra strong!"
          )}
          autoComplete="new-password"
          size="large"
        />
      </Form.Item>
      <Button
        type="primary"
        size="large"
        block
        htmlType="submit"
        loading={validating}
      >
        {t("auth:reset_password.form.submit", "Set new password")}
      </Button>
    </Form>
  );
};

export default ResetPassword;
