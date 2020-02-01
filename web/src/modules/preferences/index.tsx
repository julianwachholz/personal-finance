import { Col, Form, Radio, Row, Select, Switch } from "antd";
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
import { DateFormatButtons, InputFormat } from "./DateFormat";
import NumberFomat, {
  getNumberFormat,
  NumberFormatName,
  numberFormats
} from "./NumberFormat";

interface NumberFormatSetter {
  number_format?: NumberFormatName;
}

const Preferences = () => {
  const [t] = useTranslation("preferences");
  const history = useHistory();
  const [form] = Form.useForm();
  const { settings } = useAuth();
  const { tableSize, setTableSize } = useSettings();
  const [mutate] = useMutation(patchSettings, { refetchQueries: ["user"] });

  const [savingKeys, setSavingKeys] = useState<string[]>([]);
  const [savedKeys, setSavedKeys] = useState<string[]>([]);

  useTitle(t("preferences:title", "Preferences"));

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
      title={t("preferences:title", "Preferences")}
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
          label={t("preferences:form.label.language", "Language")}
          {...feedbackFor("language")}
        >
          <Select>
            <Select.Option value="en">English</Select.Option>
            <Select.Option value="de">Deutsch</Select.Option>
            <Select.Option value="pl">Polski</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="default_currency"
          label={t(
            "preferences:form.label.default_currency",
            "Default currency"
          )}
          {...feedbackFor("default_currency")}
        >
          <CurrencySelect />
        </Form.Item>
        <Form.Item
          name="default_debit_account"
          label={t(
            "preferences:form.label.default_debit_account",
            "Default debit account"
          )}
          {...feedbackFor("default_debit_account")}
        >
          <ModelSelect useItems={useAccounts} />
        </Form.Item>
        <Form.Item
          name="default_credit_account"
          label={t(
            "preferences:form.label.default_credit_account",
            "Default credit account"
          )}
          {...feedbackFor("default_credit_account")}
        >
          <ModelSelect useItems={useAccounts} />
        </Form.Item>
        <Form.Item
          name="default_credit_category"
          label={t(
            "preferences:form.label.default_credit_category",
            "Default credit category"
          )}
          {...feedbackFor("default_credit_category")}
        >
          <CategorySelect size="middle" />
        </Form.Item>
        <Form.Item
          name="number_format"
          label={t("preferences:form.label.number_format", "Number format")}
          {...feedbackFor("number_format")}
        >
          <NumberFomat />
        </Form.Item>
        <Form.Item
          label={t("preferences:form.label.use_colors", "Use colors?")}
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
              {t("preferences:form.use_colors_examples", "Examples:")}{" "}
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
          label={t("preferences:form.label.date_format", "Date format")}
          style={{ marginBottom: 6 }}
          {...feedbackFor("date_format")}
          rules={[
            {
              validator(rule, value: string) {
                if (value.includes("YY")) {
                  return Promise.reject(
                    t(
                      "preferences:form.error.date_format_no_YY_or_YYYY",
                      "YY and YYYY represent the local week-numbering year. Please use yy and yyyy instead."
                    )
                  );
                }
                if (value.includes("D")) {
                  return Promise.reject(
                    t(
                      "preferences:form.error.date_format_no_D_or_DD",
                      "D and DD represent the day of a year (1, 2, ..., 365, 366). Please use d and dd for days of a month."
                    )
                  );
                }
                return Promise.resolve();
              }
            }
          ]}
        >
          <InputFormat />
        </Form.Item>
        <Form.Item
          label={t("preferences:form.date_format_examples", "Example formats:")}
        >
          <DateFormatButtons onChange={onChange} form={form} />
        </Form.Item>
        <BrowserView>
          {/* <Form.Item label="Dark Mode">
            <Switch checked={theme === "dark"} onChange={toggleTheme} />
          </Form.Item> */}
          <Form.Item
            label={t("preferences:form.label.table_layout", "Table layout")}
          >
            <Radio.Group
              defaultValue={tableSize}
              buttonStyle="solid"
              onChange={e => setTableSize(e.target.value)}
            >
              <Radio.Button value="large">
                {t("preferences:form.table_layout.large", "Large")}
              </Radio.Button>
              <Radio.Button value="middle">
                {t("preferences:form.table_layout.medium", "Medium")}
              </Radio.Button>
              <Radio.Button value="small">
                {t("preferences:form.table_layout.small", "Small")}
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
        </BrowserView>
      </Form>
    </BaseModule>
  );
};

export default Preferences;
