import { Button, Col, Form, Input, Radio, Row, Select, Switch } from "antd";
import { InputProps } from "antd/lib/input";
import { format } from "date-fns";
import { de, enUS } from "date-fns/locale";
import React, { useState } from "react";
import { BrowserView } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { useHistory } from "react-router";
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

const dateFormats: string[] = ["yyyy-MM-dd", "MM/dd", "MMM d", "PPP"];

const InputFormat = ({ value, ...props }: InputProps) => {
  const [t, i18n] = useTranslation("preferences");
  const now = new Date();
  return (
    <Input
      addonAfter={
        t("preferences:date_format_preview") +
        " " +
        (value
          ? format(now, value as string, {
              locale: locales[i18n.language],
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

const locales: Record<string, Locale> = {
  en: enUS,
  de
};

const Preferences = () => {
  const [t, i18n] = useTranslation("preferences");
  const history = useHistory();
  const [form] = Form.useForm();
  const { settings } = useAuth();
  const { tableSize, setTableSize } = useSettings();
  const [mutate] = useMutation(patchSettings, { refetchQueries: ["user"] });

  const [savingKeys, setSavingKeys] = useState<string[]>([]);
  const [savedKeys, setSavedKeys] = useState<string[]>([]);

  useTitle(t("preferences:title"));

  if (!settings) {
    return <></>;
  }

  const onChange = async (values: Partial<Settings> & NumberFormatSetter) => {
    try {
      await form.validateFields();
    } catch (e) {
      return;
    }

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
  const locale = locales[i18n.language];

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
    <BaseModule
      title={t("preferences:title")}
      onLeftClick={() => {
        history.go(-1);
      }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          ...settings,
          number_format: getNumberFormat(settings)
        }}
        onValuesChange={debounce(onChange, 250)}
        wrapperCol={{ xs: 24, sm: 14 }}
      >
        <Form.Item
          name="language"
          label={t("preferences:form.label.language")}
          {...feedbackFor("language")}
        >
          <Select defaultValue={i18n.language}>
            <Select.Option value="en">English</Select.Option>
            <Select.Option value="de">Deutsch</Select.Option>
            <Select.Option value="pl">Polski</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="default_currency"
          label={t("preferences:form.label.default_currency")}
          {...feedbackFor("default_currency")}
        >
          <CurrencySelect />
        </Form.Item>
        <Form.Item
          name="default_debit_account"
          label={t("preferences:form.label.default_debit_account")}
          {...feedbackFor("default_debit_account")}
        >
          <ModelSelect useItems={useAccounts} />
        </Form.Item>
        <Form.Item
          name="default_credit_account"
          label={t("preferences:form.label.default_credit_account")}
          {...feedbackFor("default_credit_account")}
        >
          <ModelSelect useItems={useAccounts} />
        </Form.Item>
        <Form.Item
          name="default_credit_category"
          label={t("preferences:form.label.default_credit_category")}
          {...feedbackFor("default_credit_category")}
        >
          <CategorySelect size="middle" />
        </Form.Item>
        <Form.Item
          name="number_format"
          label={t("preferences:form.label.number_format")}
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
          label={t("preferences:form.label.use_colors")}
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
              {t("preferences:form.use_colors_examples")}{" "}
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
          label={t("preferences:form.label.date_format")}
          style={{ marginBottom: 6 }}
          {...feedbackFor("date_format")}
          rules={[
            {
              validator(rule, value: string) {
                if (value.includes("YY")) {
                  return Promise.reject(
                    t("preferences:form.error.date_format_no_YY_or_YYYY")
                  );
                }
                if (value.includes("D")) {
                  return Promise.reject(
                    t("preferences:form.error.date_format_no_D_or_DD")
                  );
                }
                return Promise.resolve();
              }
            }
          ]}
        >
          <InputFormat />
        </Form.Item>
        <Form.Item label={t("preferences:form.date_format_examples")}>
          {dateFormats.map(date_format => (
            <Button
              key={date_format}
              type="ghost"
              onClick={() => {
                form.setFieldsValue({ date_format });
                onChange({ date_format });
              }}
            >
              {format(now, date_format, { locale })}
            </Button>
          ))}
        </Form.Item>
        <BrowserView>
          {/* <Form.Item label="Dark Mode">
            <Switch checked={theme === "dark"} onChange={toggleTheme} />
          </Form.Item> */}
          <Form.Item label={t("preferences:form.label.table_layout")}>
            <Radio.Group
              defaultValue={tableSize}
              buttonStyle="solid"
              onChange={e => setTableSize(e.target.value)}
            >
              <Radio.Button value="large">
                {t("preferences:form.table_layout.large")}
              </Radio.Button>
              <Radio.Button value="middle">
                {t("preferences:form.table_layout.medium")}
              </Radio.Button>
              <Radio.Button value="small">
                {t("preferences:form.table_layout.small")}
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
        </BrowserView>
      </Form>
    </BaseModule>
  );
};

export default Preferences;
