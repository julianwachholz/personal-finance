import { SettingOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import React, { useState } from "react";
import { useHistory } from "react-router";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";

const { Paragraph: P } = Typography;

const Dashboard = () => {
  const history = useHistory();
  const [visible, setVisible] = useState(false);

  useTitle();
  return (
    <BaseModule
      title="Dashboard"
      rightContent={
        <SettingOutlined
          onClick={() => {
            history.push("/settings");
          }}
        />
      }
    >
      <P>TODO: Dashboard</P>
    </BaseModule>
  );
};

export default Dashboard;
