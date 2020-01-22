import { Button, Form, Input, message, Typography } from "antd";
import React, { useState } from "react";
import { isMobile } from "react-device-detect";
import { useMutation } from "react-query";
import { useHistory } from "react-router";
import { putUser, User } from "../../dao/user";
import { useAuth } from "../../utils/AuthProvider";
import { applyFormErrors } from "../../utils/errors";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";

const { Paragraph: P } = Typography;

const Profile = () => {
  const history = useHistory();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [form] = Form.useForm();
  const [updateUser] = useMutation(putUser);

  useTitle(`Profile`);
  return (
    <BaseModule
      title="Profile"
      onLeftClick={() => {
        history.go(-1);
      }}
    >
      <Form
        form={form}
        initialValues={user ?? undefined}
        onFinish={async values => {
          setLoading(true);
          try {
            await updateUser(values as User, { updateQuery: "user" });
            message.success(`Profile updated`);
            setChangePassword(false);
            form.resetFields();
          } catch (error) {
            applyFormErrors(form, error);
          }
          setLoading(false);
        }}
        layout="vertical"
        wrapperCol={{ span: 14 }}
        size={isMobile ? "large" : "middle"}
      >
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: "Enter a username" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Enter your email address"
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="first_name" label="Name">
          <Input placeholder="Optional: What shall we call you?" />
        </Form.Item>
        {changePassword
          ? [
              <Form.Item
                key="old_password"
                name="old_password"
                label="Current Password"
                rules={[
                  { required: true, message: "Enter your current password" }
                ]}
              >
                <Input.Password />
              </Form.Item>,
              <Form.Item
                key="password"
                name="password"
                label="New Password"
                rules={[{ required: true, message: "Enter a new password" }]}
              >
                <Input.Password />
              </Form.Item>
            ]
          : null}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Save Changes
          </Button>
          <Button
            onClick={() => {
              form.resetFields(["old_password", "password"]);
              setChangePassword(!changePassword);
            }}
          >
            {changePassword ? "Cancel Password Change" : "Change Password"}
          </Button>
        </Form.Item>
      </Form>
      <Button
        onClick={async () => {
          setLogoutLoading(true);
          await logout();
          setLogoutLoading(false);
          history.push(`/`, { logout: true });
        }}
        loading={logoutLoading}
        size={isMobile ? "large" : "middle"}
      >
        Logout
      </Button>
    </BaseModule>
  );
};

export default Profile;
