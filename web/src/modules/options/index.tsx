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

interface NumberFormat {
  label: string;
  decimal_separator: string;
  group_separator: string;
}

type NumberFormatName = "default" | "american" | "german" | "swiss";

type NumberFormats = {
  [F in NumberFormatName]: NumberFormat;
};

const numberFormats: NumberFormats = {
  default: {
    label: "1 000.99",
    decimal_separator: ".",
    group_separator: "\xa0"
  },
  american: {
    label: "1,000.99",
    decimal_separator: ".",
    group_separator: ","
  },
  german: {
    label: "1.000,99",
    decimal_separator: ",",
    group_separator: "."
  },
  swiss: {
    label: "1'000.99",
    decimal_separator: ".",
    group_separator: "'"
  }
};

interface NumberFormatSetter {
  number_format?: NumberFormatName;
}

const getNumberFormat = (settings: Settings): NumberFormatName => {
  const match = Object.entries(numberFormats).find(
    ([k, f]) =>
      f.group_separator === settings.group_separator &&
      f.decimal_separator === settings.decimal_separator
  );
  if (match) {
    return match[0] as NumberFormatName;
  }
  return "default";
};

const Options = () => {
  const [form] = Form.useForm();
  const { settings } = useAuth();
  const { theme, toggleTheme, tableSize, setTableSize } = useSettings();
  const [mutate] = useMutation(patchSettings, { refetchQueries: ["user"] });

  if (!settings) {
    return <></>;
  }

  const onChange = async (values: Partial<Settings> & NumberFormatSetter) => {
    if (values.number_format) {
      values = numberFormats[values.number_format];
    }
    mutate(values);
  };

  return (
    <BaseModule title="Options">
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          ...settings,
          number_format: getNumberFormat(settings)
        }}
        onValuesChange={onChange}
        wrapperCol={{ span: 12 }}
      >
        <Form.Item name="default_currency" label="Default Currency">
          <CurrencySelect />
        </Form.Item>
        <Form.Item name="default_debit_account" label="Default Debit Account">
          <ModelSelect useItems={useAccounts} />
        </Form.Item>
        <Form.Item name="default_credit_account" label="Default Credit Account">
          <ModelSelect useItems={useAccounts} />
        </Form.Item>
        <Form.Item name="number_format" label="Number Format">
          <Radio.Group>
            {Object.entries(numberFormats).map(([k, v]) => (
              <Radio.Button key={k} value={k}>
                {v.label}
              </Radio.Button>
            ))}
          </Radio.Group>
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
            <Radio.Button value="large">Large</Radio.Button>
            <Radio.Button value="middle">Medium</Radio.Button>
            <Radio.Button value="small">Small</Radio.Button>
          </Radio.Group>
        </Form.Item>
      </Form>
    </BaseModule>
  );
};

export default Options;
