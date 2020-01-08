import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal } from "antd";
import { useForm } from "antd/lib/form/util";
import React, { useState } from "react";
import { useAuth } from "../../utils/AuthProvider";
import useTitle from "../../utils/useTitle";

const Login = () => {
  const [form] = useForm();
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState<string>();
  const { login, isLoading } = useAuth();

  const onSubmit = async (values: Record<string, string>) => {
    setError(undefined);
    setValidating(true);
    try {
      await login(values);
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

  useTitle(`Login`);
  return (
    <Modal title="Login" visible centered footer={null} closable={false}>
      <Form
        form={form}
        onFinish={onSubmit}
        layout="horizontal"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item
          name="username"
          label="Username"
          validateStatus={error && "error"}
        >
          <Input autoFocus prefix={<UserOutlined />} />
        </Form.Item>
        <Form.Item
          validateStatus={error && "error"}
          help={error}
          name="password"
          label="Password"
        >
          <Input.Password prefix={<LockOutlined />} />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <>
            <Button
              type="primary"
              htmlType="submit"
              loading={validating || isLoading}
            >
              Login
            </Button>
            {/* <Link to="/">Forgot password?</Link> */}
          </>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Login;
