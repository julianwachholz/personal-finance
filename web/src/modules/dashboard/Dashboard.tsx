import { Typography } from "antd";
import React from "react";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";

const { Paragraph: P } = Typography;

const Dashboard = () => {
  useTitle();
  return (
    <BaseModule title="Dashboard">
      <P>TODO: Dashboard</P>
    </BaseModule>
  );
};

export default Dashboard;
