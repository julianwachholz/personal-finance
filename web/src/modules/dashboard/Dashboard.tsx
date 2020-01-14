import { MenuOutlined, SettingOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { Popover } from "antd-mobile";
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
        <Popover
          mask
          visible={visible}
          onVisibleChange={setVisible}
          overlay={[
            <Popover.Item key="/settings">
              <SettingOutlined /> Settings
            </Popover.Item>
          ]}
          onSelect={item => {
            history.push(item.key);
          }}
        >
          <MenuOutlined />
        </Popover>
      }
    >
      <P>TODO: Dashboard</P>
    </BaseModule>
  );
};

export default Dashboard;
