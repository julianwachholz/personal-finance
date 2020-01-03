import { Form, Input, Radio, Switch } from "antd";
import React from "react";
import { useMutation } from "react-query";
import CurrencySelect from "../../components/form/CurrencySelect";
import ModelSelect from "../../components/form/ModelSelect";
import { useAccounts } from "../../dao/accounts";
import { patchSettings, Settings } from "../../dao/settings";
import { useAuth } from "../../utils/AuthProvider";
import { useSettings } from "../../utils/SettingsProvider";
import BaseModule from "../base/BaseModule";

const Options = () => {
  const [form] = Form.useForm();
  const { settings } = useAuth();
  const { theme, toggleTheme, tableSize, setTableSize } = useSettings();
  const [mutate] = useMutation(patchSettings);

  const onChange = async (values: Partial<Settings>) => {
    mutate(values);
  };

  return (
    <BaseModule title="Options">
      <Form
        form={form}
        layout="vertical"
        initialValues={settings}
        onValuesChange={onChange}
        wrapperCol={{ span: 12 }}
      >
        <Form.Item name="default_currency" label="Default Currency">
          <CurrencySelect />
        </Form.Item>
        <Form.Item name="default_debit_account" label="Default Debit Account">
          <ModelSelect size="default" useItems={useAccounts} />
        </Form.Item>
        <Form.Item name="default_credit_account" label="Default Credit Account">
          <ModelSelect size="default" useItems={useAccounts} />
        </Form.Item>
        <Form.Item name="date_format" label="Date Format">
          <Input />
        </Form.Item>
        <Form.Item label="Dark Mode">
          <Switch checked={theme === "dark"} onChange={toggleTheme} />
        </Form.Item>
        <Form.Item label="Table Layout">
          <Radio.Group
            defaultValue={tableSize}
            buttonStyle="solid"
            onChange={e => setTableSize(e.target.value)}
          >
            <Radio.Button value="default">Default</Radio.Button>
            <Radio.Button value="middle">Medium</Radio.Button>
            <Radio.Button value="small">Small</Radio.Button>
          </Radio.Group>
        </Form.Item>
      </Form>
    </BaseModule>
  );
};

export default Options;
