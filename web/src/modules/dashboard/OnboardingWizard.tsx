import { CompassOutlined, FolderOpenOutlined } from "@ant-design/icons";
import {
  AutoComplete,
  Button,
  Col,
  Form,
  Input,
  Modal,
  Result,
  Row,
  Steps,
  Typography
} from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { Link } from "react-router-dom";
import CurrencySelect from "../../components/form/CurrencySelect";
import LanguageMenu from "../../components/form/LanguageMenu";
import MoneyInput from "../../components/form/MoneyInput";
import { Account, postAccount } from "../../dao/accounts";
import { createDefaultCategories } from "../../dao/categories";
import { patchSettings } from "../../dao/settings";
import { useAuth } from "../../utils/AuthProvider";
import { suggestedIcons } from "../accounts/Form";
import { DateFormatRadio } from "../preferences/DateFormat";
import NumberFomat, {
  getNumberFormat,
  NumberFormatName,
  numberFormats
} from "../preferences/NumberFormat";

const { Paragraph: P } = Typography;

interface OnboardingWizardProps {
  visible: boolean;
  onVisible?: (visible: boolean) => void;
}

const defaultCurrencyByLanguage: Record<string, string> = {
  en: "USD",
  de: "EUR",
  pl: "PLN"
};

export const OnboardingWizard = ({
  visible,
  onVisible
}: OnboardingWizardProps) => {
  const [t, i18n] = useTranslation();
  const { settings } = useAuth();
  const [setupForm] = Form.useForm();
  const [accountForm] = Form.useForm();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [updateSettings] = useMutation(patchSettings, {
    refetchQueries: ["user"]
  });
  const [createAccount] = useMutation(postAccount);
  const [importCategories] = useMutation(createDefaultCategories);

  return (
    <Modal
      width={800}
      maskClosable={false}
      closable={false}
      visible={visible}
      keyboard={false}
      footer={null}
    >
      <div className="modal-wizard">
        <Steps current={step}>
          <Steps.Step title={t("onboarding.welcome.title", "Welcome")} />
          <Steps.Step title={t("onboarding.setup.title", "Setup")} />
          <Steps.Step title={t("onboarding.account.title", "First Account")} />
          <Steps.Step title={t("onboarding.categories.title", "Categories")} />
        </Steps>
        <div className="modal-wizard-content">
          {step === 0 && (
            <Result
              icon={<CompassOutlined />}
              title={t("onboarding.welcome.intro", "Getting started")}
              subTitle={t(
                "onboarding.welcome.subtitle",
                "Follow these quick steps to get up and running in a minute!"
              )}
              extra={
                <LanguageMenu
                  label={t(
                    "onboarding.welcome.language",
                    "Select your language"
                  )}
                  onChange={async language => {
                    setLoading(true);
                    await updateSettings({ language });
                    setLoading(false);
                  }}
                />
              }
            />
          )}
          {step === 1 && (
            <Form
              form={setupForm}
              layout="horizontal"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              initialValues={{
                default_currency:
                  settings?.default_currency ||
                  defaultCurrencyByLanguage[i18n.language],
                number_format: settings ? getNumberFormat(settings) : "default",
                date_format: settings?.date_format || "yyyy-MM-dd"
              }}
              onFinish={async values => {
                setLoading(true);
                if (values.number_format) {
                  values = {
                    ...values,
                    ...numberFormats[values.number_format as NumberFormatName]
                  };
                }
                await updateSettings(values);
                setLoading(false);
                setStep(step + 1);
              }}
            >
              <P>
                {t(
                  "onboarding.setup.change_later",
                  "You can change all of these later under 'Preferences'."
                )}
              </P>
              <Form.Item
                name="default_currency"
                label={t(
                  "onboarding.setup.default_currency",
                  "Select your primary currency"
                )}
              >
                <CurrencySelect style={{ width: 300 }} />
              </Form.Item>
              <Form.Item
                name="number_format"
                label={t("onboarding.setup.number_format", "Number format")}
              >
                <NumberFomat />
              </Form.Item>
              <Form.Item
                name="date_format"
                label={t("onboarding.setup.date_format", "Date format")}
              >
                <DateFormatRadio />
              </Form.Item>
            </Form>
          )}
          {step === 2 && (
            <Form
              form={accountForm}
              layout="horizontal"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 10 }}
              initialValues={{
                icon: "💰",
                name: t("onboarding.account.default_account_name", "Checking"),
                set_balance: "0"
              }}
              onFinish={async values => {
                setLoading(true);
                values.set_currency = settings?.default_currency;
                const account = await createAccount(values as Account);
                if (!settings?.default_debit_account) {
                  await updateSettings({
                    default_debit_account: {
                      value: account.pk,
                      label: account.label
                    }
                  });
                }
                setLoading(false);
                setStep(step + 1);
              }}
            >
              <P>
                {t(
                  "onboarding.account.intro",
                  "Create your first account. This could be your primary spending account."
                )}
              </P>
              <Form.Item
                label={t("onboarding.account.account_name", "Account Name")}
              >
                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item name="icon" noStyle>
                      <AutoComplete
                        options={suggestedIcons}
                        dropdownStyle={{ textAlign: "center" }}
                      >
                        <Input maxLength={1} style={{ textAlign: "center" }} />
                      </AutoComplete>
                    </Form.Item>
                  </Col>
                  <Col span={18}>
                    <Form.Item
                      name="name"
                      noStyle
                      rules={[
                        {
                          required: true,
                          message: t(
                            "onboarding.account.account_name_required",
                            "An account name is required"
                          )
                        }
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>
              <Form.Item
                label={t(
                  "onboarding.account.current_balance",
                  "Current Balance"
                )}
              >
                <Input.Group compact>
                  <Form.Item
                    name="set_balance"
                    noStyle
                    rules={[
                      {
                        required: true,
                        message: t(
                          "onboarding.account.current_balance_required",
                          "Enter the account's current balance"
                        )
                      }
                    ]}
                  >
                    <MoneyInput />
                  </Form.Item>
                  <Input
                    disabled
                    readOnly
                    value={settings?.default_currency}
                    style={{ width: 55, textAlign: "center" }}
                  />
                </Input.Group>
              </Form.Item>
            </Form>
          )}
          {step === 3 && (
            <Result
              icon={<FolderOpenOutlined />}
              title={t("onboarding.categories.intro", "Example Categories")}
              subTitle={t(
                "onboarding.categories.subtitle",
                "You can import a set of example categories to get a head start categorizing your transactions."
              )}
              extra={
                <Button
                  type="primary"
                  loading={loading}
                  onClick={async () => {
                    setLoading(true);
                    await importCategories();
                    setLoading(false);
                    setStep(step + 1);
                  }}
                >
                  {t("onboarding.categories.button", "Import")}
                </Button>
              }
            />
          )}
          {step === 4 && (
            <Result
              status="success"
              title={t("onboarding.finish.title", "Ready!")}
              subTitle={t(
                "onboarding.finish.subtitle",
                "You can now continue with any of these actions:"
              )}
              extra={[
                <Button key="payee">
                  <Link to="/settings/payees">
                    {t("onboarding.finish.manage_payees", "Create Payees")}
                  </Link>
                </Button>,
                <Button key="tx">
                  <Link to="/transactions">
                    {t("onboarding.finish.transactions", "Enter Transactions")}
                  </Link>
                </Button>,
                <Button key="add_account">
                  <Link to="/accounts/create">
                    {t("onboarding.finish.add_account", "Add Account")}
                  </Link>
                </Button>,
                <Button key="category">
                  <Link to="/settings/categories">
                    {t(
                      "onboarding.finish.manage_categories",
                      "Manage Categories"
                    )}
                  </Link>
                </Button>
              ]}
            />
          )}
        </div>
        <Row>
          <Col span={12}>
            {step > 0 && step < 4 && (
              <Button type="primary" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}

            <Button
              type="link"
              onClick={() => {
                onVisible?.(false);
              }}
            >
              {step === 4
                ? t("wizard.close", "Close")
                : t("wizard.cancel", "Cancel")}
            </Button>
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            {step < 4 && (
              <Button
                type={step === 3 ? "default" : "primary"}
                onClick={() => {
                  switch (step) {
                    case 1:
                      setupForm.submit();
                      break;
                    case 2:
                      accountForm.submit();
                      break;
                    default:
                      setStep(step + 1);
                      break;
                  }
                }}
                loading={loading}
              >
                {step === 3
                  ? t("wizard.skip", "Skip")
                  : t("wizard.next", "Next")}
              </Button>
            )}
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default OnboardingWizard;
