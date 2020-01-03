import { Button, Col, Form, Input, Row, Select } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import MoneyInput from "../../components/form/MoneyInput";
import { Account } from "../../dao/accounts";

interface FormProps {
  data?: Account;
  onSave: (values: Account) => Promise<void>;
}

const AccountForm = ({ data, onSave }: FormProps) => {
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
    if (values.balance) {
      values = {
        ...values,
        set_balance: values.balance.amount,
        set_currency: values.balance.currency
      };
    }
    onSave(values);
  };

  const balance = data
    ? {
        amount: data.balance,
        currency: data.currency
      }
    : {
        amount: "0.00",
        currency: "CHF" // TODO default currency
      };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      initialValues={{ ...data, balance }}
    >
      <Row gutter={16}>
        <Col span={2}>
          <Form.Item name="icon" label="Icon">
            <Input placeholder="💵" style={{ textAlign: "center" }} />
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
        <Row>
          <Col span={6}>
            <Form.Item name="balance" label="Initial Balance" required>
              <MoneyInput />
            </Form.Item>
          </Col>
          <Col span={18}>
            <Form.Item
              name="balance_currency"
              label="Currency"
              rules={[{ required: true, message: "Select a currency" }]}
            >
              <Select></Select>
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
