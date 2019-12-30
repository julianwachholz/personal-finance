import { Radio, Switch, Typography } from "antd";
import React from "react";
import { useSettings } from "../../utils/SettingsProvider";
import BaseModule from "../base/BaseModule";

const { Paragraph: P } = Typography;

const Options = () => {
  const { theme, toggleTheme, tableSize, setTableSize } = useSettings();
  return (
    <BaseModule title="Options">
      <P>
        <label>
          Dark Mode:{" "}
          <Switch checked={theme === "dark"} onChange={toggleTheme} />
        </label>
      </P>
      <P>
        Table Layout:{" "}
        <Radio.Group
          defaultValue={tableSize}
          buttonStyle="solid"
          onChange={e => setTableSize(e.target.value)}
        >
          <Radio.Button value="default">Default</Radio.Button>
          <Radio.Button value="middle">Medium</Radio.Button>
          <Radio.Button value="small">Small</Radio.Button>
        </Radio.Group>
      </P>
    </BaseModule>
  );
};

export default Options;
