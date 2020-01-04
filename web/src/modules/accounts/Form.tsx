import { Button, Col, Form, Input, Row } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import CurrencySelect from "../../components/form/CurrencySelect";
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
        set_balance: values.balance,
        set_currency: values.currency
      };
    }
    onSave(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      initialValues={data}
    >
      <Row gutter={16}>
        <Col span={2}>
          <Form.Item name="icon" label="Icon">
            <Input
              maxLength={1}
              placeholder="💵"
              style={{ textAlign: "center" }}
            />
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
            <Form.Item name="balance" label="Initial Balance" required>
              <MoneyInput size="middle" fullWidth />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              name="currency"
              label="Currency"
              rules={[{ required: true, message: "Select a currency" }]}
            >
              <CurrencySelect />
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
