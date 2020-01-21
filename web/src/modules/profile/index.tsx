import { Button, Typography } from "antd";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { useAuth } from "../../utils/AuthProvider";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";

const { Paragraph: P } = Typography;

const Profile = () => {
  const history = useHistory();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  useTitle(`Profile`);
  return (
    <BaseModule
      title="Profile"
      onLeftClick={() => {
        history.go(-1);
      }}
    >
      <P>Logged in as: {user?.username}</P>
      <Button
        onClick={async () => {
          setLoading(true);
          await logout();
          setLoading(false);
          history.push(`/`, { logout: true });
        }}
        loading={loading}
      >
        Logout
      </Button>
    </BaseModule>
  );
};

export default Profile;
