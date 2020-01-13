import { Button, Col, Form, Input, Radio, Row, Switch } from "antd";
import { InputProps } from "antd/lib/input";
import { format } from "date-fns";
import React, { useState } from "react";
import { useMutation } from "react-query";
import Money from "../../components/data/Money";
import CategorySelect from "../../components/form/CategorySelect";
import CurrencySelect from "../../components/form/CurrencySelect";
import ModelSelect from "../../components/form/ModelSelect";
import { useAccounts } from "../../dao/accounts";
import { patchSettings, Settings } from "../../dao/settings";
import { useAuth } from "../../utils/AuthProvider";
import { debounce } from "../../utils/debounce";
import { useSettings } from "../../utils/SettingsProvider";
import useTitle from "../../utils/useTitle";
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

const dateFormats: string[] = ["yyyy-MM-dd", "MM/dd", "MMM d", "eee, MMM do"];

const InputFormat = ({ value, ...props }: InputProps) => {
  const now = new Date();
  return (
    <Input
      addonAfter={
        "Preview: " +
        (value
          ? format(now, value as string, {
              useAdditionalDayOfYearTokens: true,
              useAdditionalWeekYearTokens: true
            })
          : "")
      }
      value={value}
      {...props}
    />
  );
};

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

const Preferences = () => {
  const [form] = Form.useForm();
  const { settings } = useAuth();
  const { theme, toggleTheme, tableSize, setTableSize } = useSettings();
  const [mutate] = useMutation(patchSettings, { refetchQueries: ["user"] });

  const [savingKeys, setSavingKeys] = useState<string[]>([]);
  const [savedKeys, setSavedKeys] = useState<string[]>([]);

  useTitle(`Preferences`);

  if (!settings) {
    return <></>;
  }

  const onChange = async (values: Partial<Settings> & NumberFormatSetter) => {
    const keys = Object.keys(values);
    setSavingKeys(keys);
    if (values.number_format) {
      values = numberFormats[values.number_format];
    }
    await mutate(values);
    setTimeout(() => {
      setSavingKeys([]);
      setSavedKeys(keys);
    }, 100);
    setTimeout(() => {
      setSavedKeys([]);
    }, 2000);
  };

  const now = new Date();
  const feedbackFor = (name: string) => {
    let validateStatus: "validating" | "success" | undefined;
    if (savingKeys.includes(name)) {
      validateStatus = "validating";
    }
    if (savedKeys.includes(name)) {
      validateStatus = "success";
    }
    return {
      hasFeedback: validateStatus !== undefined,
      validateStatus
    };
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
        onValuesChange={debounce(onChange, 100, true)}
        wrapperCol={{ span: 14 }}
      >
        <Form.Item
          name="default_currency"
          label="Default Currency"
          {...feedbackFor("default_currency")}
        >
          <CurrencySelect />
        </Form.Item>
        <Form.Item
          name="default_debit_account"
          label="Default Debit Account"
          {...feedbackFor("default_debit_account")}
        >
          <ModelSelect useItems={useAccounts} />
        </Form.Item>
        <Form.Item
          name="default_credit_account"
          label="Default Credit Account"
          {...feedbackFor("default_credit_account")}
        >
          <ModelSelect useItems={useAccounts} />
        </Form.Item>
        <Form.Item
          name="default_credit_category"
          label="Default Credit Category"
          {...feedbackFor("default_credit_category")}
        >
          <CategorySelect size="middle" />
        </Form.Item>
        <Form.Item
          name="number_format"
          label="Number Format"
          {...feedbackFor("number_format")}
        >
          <Radio.Group>
            {Object.entries(numberFormats).map(([k, v]) => (
              <Radio.Button key={k} value={k}>
                {v.label}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="Use Colors?"
          htmlFor="use_colors"
          {...feedbackFor("use_colors")}
        >
          <Row>
            <Col span={4}>
              <Form.Item name="use_colors" noStyle valuePropName="checked">
                <Switch loading={savingKeys.includes("use_colors")} />
              </Form.Item>
            </Col>
            <Col span={20}>
              Examples:{" "}
              <Money
                value={{
                  amount: "4321.00",
                  currency: settings.default_currency
                }}
              />
              {", "}
              <Money value={{ amount: "-1590.42", currency: "EUR" }} />
            </Col>
          </Row>
        </Form.Item>
        <Form.Item
          name="date_format"
          label="Date Format"
          style={{ marginBottom: 6 }}
          {...feedbackFor("date_format")}
        >
          <InputFormat />
        </Form.Item>
        <Form.Item label="Example Formats">
          {dateFormats.map(date_format => (
            <Button
              key={date_format}
              type="ghost"
              onClick={() => {
                form.setFieldsValue({ date_format });
                onChange({ date_format });
              }}
            >
              {format(now, date_format)}
            </Button>
          ))}
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

export default Preferences;
