import { MailOutlined } from "@ant-design/icons";
import { Button, Form, Input, Result } from "antd";
import { useForm } from "antd/lib/form/util";
import React, { useState } from "react";
import { useMutation } from "react-query";
import { RouteComponentProps, useHistory } from "react-router";
import { postForgotPassword } from "../../dao/user";
import { applyFormErrors } from "../../utils/errors";
import useTitle from "../../utils/useTitle";

interface RecoverLocationState {
  submitted?: boolean;
}

const Recover = ({
  location
}: RouteComponentProps<{}, {}, RecoverLocationState>) => {
  const history = useHistory();
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

  useTitle(`Forgot Password`);
  return hasSubmitted ? (
    <Result
      status="info"
      title="Check your inbox"
      subTitle="We've sent an email with instructions on how to reset your password."
    />
  ) : (
    <Form
      form={form}
      onFinish={data => onSubmit(data as any)}
      layout="vertical"
    >
      <h2>Forgot Password</h2>
      <Form.Item
        name="email"
        label="Email"
        rules={[
          {
            required: true,
            type: "email",
            message: "Please enter your email address"
          }
        ]}
      >
        <Input
          autoFocus
          prefix={<MailOutlined />}
          placeholder="catlover3000@cool.website"
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
        Reset Password
      </Button>
    </Form>
  );
};

export default Recover;
