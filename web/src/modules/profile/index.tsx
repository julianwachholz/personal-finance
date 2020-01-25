import { LogoutOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import React, { useState } from "react";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { RouteComponentProps } from "react-router";
import { putUser, User } from "../../dao/user";
import { useAuth } from "../../utils/AuthProvider";
import { applyFormErrors } from "../../utils/errors";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";

const Profile = ({ history }: RouteComponentProps) => {
  const [t] = useTranslation("profile");
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [form] = Form.useForm();
  const [updateUser] = useMutation(putUser);

  useTitle(t("profile:title"));
  return (
    <BaseModule
      title={t("profile:title")}
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
            message.success(t("profile:message.profile_updated"));
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
          label={t("profile:form.label.username")}
          rules={[
            {
              required: true,
              message: t("profile:form.error.username_required")
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label={t("profile:form.label.email")}
          rules={[
            {
              required: true,
              type: "email",
              message: t("profile:form.error.email_required")
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="first_name" label={t("profile:form.label.name")}>
          <Input placeholder={t("profile:form.placeholder.name_optional")} />
        </Form.Item>
        {changePassword
          ? [
              <Form.Item
                key="old_password"
                name="old_password"
                label={t("profile:form.label.old_password")}
                rules={[
                  {
                    required: true,
                    message: t("profile:form.error.old_password_required")
                  }
                ]}
              >
                <Input.Password />
              </Form.Item>,
              <Form.Item
                key="password"
                name="password"
                label={t("profile:form.label.new_password")}
                rules={[
                  {
                    required: true,
                    message: t("profile:form.error.new_password_required")
                  }
                ]}
              >
                <Input.Password />
              </Form.Item>
            ]
          : null}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {t("profile:form.submit")}
          </Button>
          <Button
            onClick={() => {
              form.resetFields(["old_password", "password"]);
              setChangePassword(!changePassword);
            }}
          >
            {changePassword
              ? t("profile:form.cancel_change_password")
              : t("profile:form.change_password")}
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
        <LogoutOutlined />
        {t("profile:logout")}
      </Button>
    </BaseModule>
  );
};

export default Profile;
