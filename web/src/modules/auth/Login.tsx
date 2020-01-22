import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Alert, Button, Col, Form, Input, Row } from "antd";
import { useForm } from "antd/lib/form/util";
import React, { useState } from "react";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { useAuth } from "../../utils/AuthProvider";
import useTitle from "../../utils/useTitle";

const Login = ({ location, history }: RouteComponentProps) => {
  const [form] = useForm();
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState<string>();
  const { login, isLoading } = useAuth();

  const onSubmit = async (values: Record<string, string>) => {
    setError(undefined);
    setValidating(true);
    try {
      await login(values);
      history.push(`/`);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError(e.non_field_errors[0]);
      }
    }
    setValidating(false);
    form.resetFields();
  };

  const initial = { username: location.state?.username };

  useTitle(`Login`);
  return (
    <Form
      form={form}
      onFinish={onSubmit}
      layout="vertical"
      initialValues={initial}
    >
      <h2>Login</h2>
      {location.state?.verified && (
        <Alert
          type="success"
          message="Account activated! You can now log in."
          style={{ marginBottom: 24 }}
        />
      )}
      {location.state?.resetPassword && (
        <Alert
          type="success"
          message="Password has been reset. You can now log in."
          style={{ marginBottom: 24 }}
        />
      )}
      {location.state?.logout && (
        <Alert
          type="info"
          message="You have been logged out!"
          style={{ marginBottom: 24 }}
        />
      )}
      <Form.Item
        name="username"
        // label="Username"
        validateStatus={error && "error"}
      >
        <Input
          autoFocus
          prefix={<UserOutlined />}
          placeholder="Username"
          autoComplete="username"
          inputMode="email"
          size="large"
        />
      </Form.Item>
      <Form.Item
        validateStatus={error && "error"}
        help={error}
        name="password"
        // label="Password"
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Password"
          autoComplete="current-password"
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
            loading={validating || isLoading}
          >
            Login
          </Button>
        </Col>
        <Col xs={12} sm={8}>
          <Button size="large" block>
            <Link to="/register">Register</Link>
          </Button>
        </Col>
        <Col xs={12} sm={8}>
          <Button type="link" size="large" block>
            <Link to="/forgot-password">Forgot password?</Link>
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default Login;
