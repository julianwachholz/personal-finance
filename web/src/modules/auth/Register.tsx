import {
  ContactsOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Button, Col, Form, Input, Result, Row } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { Link, RouteComponentProps } from "react-router-dom";
import { postUser, User } from "../../dao/user";
import { applyFormErrors } from "../../utils/errors";
import useTitle from "../../utils/useTitle";

interface RegisterLocationState {
  submitted?: true;
}

export const Register = ({
  location,
  history
}: RouteComponentProps<{}, {}, RegisterLocationState>) => {
  const [t] = useTranslation("auth");
  const [form] = Form.useForm();
  const [validating, setValidating] = useState(false);
  const [register] = useMutation(postUser);

  const onSubmit = async (values: User) => {
    setValidating(true);
    try {
      await register(values);
      history.replace(`/register`, { submitted: true });
    } catch (error) {
      applyFormErrors(form, error);
    }
    setValidating(false);
  };

  const hasSubmitted = location.state?.submitted === true;

  useTitle(t("auth:register.title", "Register"));
  return hasSubmitted ? (
    <Result
      status="success"
      title={t("auth:register.success_title", "Registration Complete")}
      subTitle={t(
        "auth:register.success_message",
        "Check your email inbox for a message from us."
      )}
    />
  ) : (
    <Form
      form={form}
      onFinish={values => onSubmit(values as User)}
      layout="vertical"
    >
      <h2>{t("auth:register.title", "Register")}</h2>
      <Form.Item
        name="username"
        label={t("auth:register.form.username", "Username")}
        rules={[
          {
            required: true,
            message: t(
              "auth:register.form.username_required",
              "Please enter a username"
            )
          }
        ]}
      >
        <Input
          autoFocus
          prefix={<UserOutlined />}
          placeholder={t(
            "auth:register.form.username_placeholder",
            "catlover3000"
          )}
          autoComplete="off"
          inputMode="email"
          size="large"
        />
      </Form.Item>
      <Form.Item
        name="email"
        label={t("auth:register.form.email", "Email")}
        rules={[
          {
            required: true,
            type: "email",
            message: t(
              "auth:register.form.email_required",
              "Please enter your email"
            )
          }
        ]}
      >
        <Input
          prefix={<MailOutlined />}
          placeholder={t(
            "auth:register.form.email_placeholder",
            "catlover3000@cool.website"
          )}
          type="email"
          size="large"
        />
      </Form.Item>
      <Form.Item
        name="first_name"
        label={t("auth:register.form.name", "Your Name")}
      >
        <Input
          prefix={<ContactsOutlined />}
          placeholder={t(
            "auth:register.form.name_placeholder",
            "Optional: What shall we call you?"
          )}
          size="large"
        />
      </Form.Item>
      <Form.Item
        name="password"
        label={t("auth:register.form.password", "Password")}
        rules={[
          {
            required: true,
            message: t(
              "auth:register.form.password_required",
              "Please choose a password"
            )
          }
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder={t(
            "auth:register.form.password_placeholder",
            "Make it strong!"
          )}
          autoComplete="new-password"
          size="large"
        />
      </Form.Item>
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={8}>
          <Button
            type="primary"
            size="large"
            block
            htmlType="submit"
            loading={validating}
          >
            {t("auth:register.form.submit", "Register")}
          </Button>
        </Col>
        <Col xs={12} sm={8}>
          <Button size="large" block>
            <Link to="/">{t("auth:register.login_link", "Login")}</Link>
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default Register;
