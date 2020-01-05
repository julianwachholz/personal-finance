import { AutoComplete, Button, Col, Form, Input, Row } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import CurrencySelect from "../../components/form/CurrencySelect";
import MoneyInput from "../../components/form/MoneyInput";
import { Account } from "../../dao/accounts";
import { useAuth } from "../../utils/AuthProvider";

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
    onSave(values);
  };

  const initialValues: Partial<Account> = { ...data };
  if (!data?.pk) {
    initialValues.set_balance = "0.00";
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
    >
      <Row gutter={16}>
        <Col span={2}>
          <Form.Item name="icon" label="Icon">
            <AutoComplete
              options={suggestedIcons}
              dropdownStyle={{ textAlign: "center" }}
            >
              <Input maxLength={1} style={{ textAlign: "center" }} />
            </AutoComplete>
          </Form.Item>
        </Col>
        <Col span={22}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Enter a name" }]}
          >
            <Input placeholder="Checking" />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item name="institution" label="Institution">
        <Input placeholder="Example Credit Union" />
      </Form.Item>
      {data?.pk && !resetBalance ? (
        <Button onClick={() => setResetBalance(true)}>Reset balance?</Button>
      ) : (
        <Row gutter={16}>
          <Col span={4}>
            <Form.Item name="set_balance" label="Initial Balance" required>
              <MoneyInput size="middle" fullWidth />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              name="set_currency"
              label="Currency"
              rules={[{ required: true, message: "Select a currency" }]}
            >
              <CurrencySelect disabled={!!data?.pk} />
            </Form.Item>
          </Col>
        </Row>
      )}
      <Form.Item className="form-actions">
        <>
          <Button type="primary" htmlType="submit" loading={submitting}>
            Save Account
          </Button>
          <Link to={(data && `/accounts/${data.pk}`) ?? `/accounts`}>
            <Button>Discard</Button>
          </Link>
        </>
      </Form.Item>
    </Form>
  );
};

export default AccountForm;
