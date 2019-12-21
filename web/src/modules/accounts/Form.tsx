import { Button, Col, Form, Input, Row } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import MoneyInput from "../../components/form/MoneyInput";
import { Account } from "../../dao/accounts";

interface FormProps {
  data?: Account;
  onSave: (values: Account) => Promise<void>;
}

const AccountForm = ({ data, onSave }: FormProps) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const onSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      await form.validateFields();
    } catch (e) {
      setSubmitting(false);
      debugger;
      return;
    }
    const newData: Account = {
      ...values,
      balance: values.balance.amount,
      balance_currency: values.balance.currency
    };
    onSave(newData);
  };

  const balance = data && {
    amount: data.balance,
    currency: data.balance_currency
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
          <Form.Item name="name" label="Name" required>
            <Input placeholder="Checking" />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item name="institution" label="Institution">
        <Input placeholder="Example Credit Union" />
      </Form.Item>
      <Form.Item name="balance" label="Balance" required>
        <MoneyInput />
      </Form.Item>
      <Form.Item>
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
