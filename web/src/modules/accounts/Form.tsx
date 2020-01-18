import { AutoComplete, Button, Col, Form, Input, Row } from "antd";
import React, { useState } from "react";
import { BrowserView, isMobile } from "react-device-detect";
import { Link } from "react-router-dom";
import CurrencySelect from "../../components/form/CurrencySelect";
import MoneyInput from "../../components/form/MoneyInput";
import { Account } from "../../dao/accounts";
import { useAuth } from "../../utils/AuthProvider";
import { applyFormErrors } from "../../utils/errors";

interface FormProps {
  data?: Account;
  onSave: (values: Account) => Promise<void>;
}

const ICONS: string[] = [
  "💵",
  "💴",
  "💶",
  "💷",
  "💰",
  "💳",
  "🧾",
  "🏦",
  "🏛️",
  "💎",
  "👝",
  "👛",
  "📱",
  "📈",
  "💲",
  "💸",
  "🤑"
];
const suggestedIcons = ICONS.map(icon => ({
  value: icon
}));

const AccountForm = ({ data, onSave }: FormProps) => {
  const { settings } = useAuth();
  const [resetBalance, setResetBalance] = useState(false);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const onSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      await form.validateFields();
    } catch (e) {
      setSubmitting(false);
      return;
    }
    if (data?.pk && !resetBalance) {
      delete values["set_balance"];
      delete values["set_currency"];
    }
    try {
      await onSave(values);
    } catch (error) {
      setSubmitting(false);
      applyFormErrors(form, error);
    }
  };

  const initialValues: Partial<Account> = { ...data };
  if (!data?.pk) {
    initialValues.set_currency = settings?.default_currency;
  } else {
    initialValues.set_balance = data.balance;
    initialValues.set_currency = data.currency;
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      initialValues={initialValues}
      size={isMobile ? "large" : "middle"}
    >
      <Row gutter={16}>
        <Col xs={4} sm={2}>
          <Form.Item name="icon" label="Icon">
            <AutoComplete
              options={suggestedIcons}
              dropdownStyle={{ textAlign: "center" }}
            >
              <Input maxLength={1} style={{ textAlign: "center" }} />
            </AutoComplete>
          </Form.Item>
        </Col>
        <Col xs={20} sm={12}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Enter a name" }]}
          >
            <Input placeholder="Checking" autoFocus />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item name="institution" label="Institution" wrapperCol={{ sm: 14 }}>
        <Input placeholder="Example Credit Union" />
      </Form.Item>
      {data?.pk && !resetBalance ? (
        <Form.Item>
          <Button onClick={() => setResetBalance(true)}>Reset balance?</Button>
        </Form.Item>
      ) : (
        <Row gutter={16}>
          <Col xs={18} sm={4}>
            <Form.Item
              name="set_balance"
              label="Current Balance"
              rules={[{ required: true, message: "Enter a balance" }]}
            >
              <MoneyInput size={isMobile ? "large" : "middle"} fullWidth />
            </Form.Item>
          </Col>
          <Col xs={6} sm={6}>
            <Form.Item
              name="set_currency"
              label="Currency"
              rules={[{ required: true, message: "Select a currency" }]}
            >
              <CurrencySelect
                disabled={!!data?.pk}
                dropdownMatchSelectWidth={300}
                dropdownAlign={
                  isMobile
                    ? { points: ["tr", "br"], offset: [0, 4] }
                    : undefined
                }
              />
            </Form.Item>
          </Col>
        </Row>
      )}
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={submitting}
          block={isMobile}
        >
          Save Account
        </Button>
        <BrowserView>
          <Link to={(data && `/accounts/${data.pk}`) ?? `/accounts`}>
            <Button>Discard</Button>
          </Link>
        </BrowserView>
      </Form.Item>
    </Form>
  );
};

export default AccountForm;
