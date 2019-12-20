import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal } from "antd";
import { useForm } from "antd/lib/form/util";
import React, { useState } from "react";
import { useMutation } from "react-query";
import { setAuthToken } from "../../dao/base";
import { postLogin } from "../../dao/user";

const Login: React.FC = () => {
  const [form] = useForm();
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState<string>();
  const [login] = useMutation(postLogin, { refetchQueries: ["user"] });

  const onSubmit = async (values: Record<string, string>) => {
    setError(undefined);
    setValidating(true);
    try {
      const result = await login(values);
      setAuthToken(result.token, result.expiry);
    } catch (e) {
      setError(e.non_field_errors.join(","));
    }
    setValidating(false);
    form.resetFields();
  };

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
            <Button type="primary" htmlType="submit" loading={validating}>
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
