import { MailOutlined } from "@ant-design/icons";
import { Button, Form, Input, Result } from "antd";
import { useForm } from "antd/lib/form/util";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { RouteComponentProps } from "react-router";
import { postForgotPassword } from "../../dao/user";
import { applyFormErrors } from "../../utils/errors";
import useTitle from "../../utils/useTitle";

interface RecoverLocationState {
  submitted?: boolean;
}

const Recover = ({
  location,
  history
}: RouteComponentProps<{}, {}, RecoverLocationState>) => {
  const [t] = useTranslation("auth");
  const [form] = useForm();
  const [validating, setValidating] = useState(false);
  const [forgotPassword] = useMutation(postForgotPassword);

  const onSubmit = async (values: { email: string }) => {
    setValidating(true);
    try {
      await forgotPassword(values);
      history.replace(`/forgot-password`, { submitted: true });
    } catch (error) {
      applyFormErrors(form, error);
    }
    setValidating(false);
  };

  const hasSubmitted = location.state?.submitted === true;

  useTitle(t("auth:forgot_password.title", "Forgot password"));
  return hasSubmitted ? (
    <Result
      status="info"
      title={t("auth:forgot_password.success_title", "Check your inbox")}
      subTitle={t(
        "auth:forgot_password.success_message",
        "We've sent an email with instructions on how to reset your password."
      )}
    />
  ) : (
    <Form
      form={form}
      onFinish={data => onSubmit(data as any)}
      layout="vertical"
    >
      <h2>{t("auth:forgot_password.title", "Forgot password")}</h2>
      <Form.Item
        name="email"
        label={t("auth:forgot_password.form.email", "Email")}
        rules={[
          {
            required: true,
            type: "email",
            message: t(
              "auth:forgot_password.form.email_required",
              "Please enter your email address"
            )
          }
        ]}
      >
        <Input
          autoFocus
          prefix={<MailOutlined />}
          placeholder={t(
            "auth:forgot_password.form.email_placeholder",
            "catlover3000@cool.website"
          )}
          type="email"
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
        {t("auth:forgot_password.submit", "Reset Password")}
      </Button>
    </Form>
  );
};

export default Recover;
