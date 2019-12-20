import { Button, Typography } from "antd";
import React, { useState } from "react";
import { RouteComponentProps } from "react-router";
import { useAuth } from "../../utils/AuthProvider";
import BaseModule from "../base/BaseModule";

const { Paragraph: P } = Typography;

const Profile: React.FC<RouteComponentProps> = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  return (
    <BaseModule title="Profile">
      <P>Logged in as: {user!.username}</P>
      <Button
        onClick={async () => {
          setLoading(true);
          await logout();
          setLoading(false);
        }}
        loading={loading}
      >
        Logout
      </Button>
    </BaseModule>
  );
};

export default Profile;
