import {
  ContactsOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Button, Col, Form, Input, Result, Row } from "antd";
import React, { useState } from "react";
import { useMutation } from "react-query";
import { Link, RouteComponentProps } from "react-router-dom";
import { postUser, User } from "../../dao/user";
import { applyFormErrors } from "../../utils/errors";
import useTitle from "../../utils/useTitle";

export const Register = ({ location, history }: RouteComponentProps) => {
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

  useTitle(`Register`);
  return hasSubmitted ? (
    <Result
      status="success"
      title="Registration Complete"
      subTitle="Check your email inbox for a message from us."
    />
  ) : (
    <Form
      form={form}
      onFinish={values => onSubmit(values as User)}
      layout="vertical"
    >
      <h2>Register</h2>
      <Form.Item
        name="username"
        label="Username"
        rules={[{ required: true, message: "Please enter a username" }]}
      >
        <Input
          autoFocus
          prefix={<UserOutlined />}
          placeholder="catlover3000"
          autoComplete="off"
          inputMode="email"
          size="large"
        />
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, type: "email", message: "Please enter your email" }
        ]}
      >
        <Input
          prefix={<MailOutlined />}
          placeholder="catlover3000@cool.website"
          type="email"
          size="large"
        />
      </Form.Item>
      <Form.Item name="first_name" label="Your Name">
        <Input
          prefix={<ContactsOutlined />}
          placeholder="Optional: What shall we call you?"
          size="large"
        />
      </Form.Item>
      <Form.Item
        name="password"
        label="Password"
        rules={[{ required: true, message: "Please choose a password" }]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Make it strong!"
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
            Register
          </Button>
        </Col>
        <Col xs={12} sm={8}>
          <Button size="large" block>
            <Link to="/">Login</Link>
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default Register;
