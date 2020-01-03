import { Button, Col, Form, Input, Radio, Row } from "antd";
import { useForm } from "antd/lib/form/util";
import { InputNumberProps } from "antd/lib/input-number";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import CategorySelect from "../../components/form/CategorySelect";
import ModelSelect from "../../components/form/ModelSelect";
import MoneyInput from "../../components/form/MoneyInput";
import { useAccounts } from "../../dao/accounts";
import { usePayees } from "../../dao/payees";
import { useTags } from "../../dao/tags";
import { Transaction } from "../../dao/transactions";

interface FormProps {
  data?: Transaction;
  onSave: (values: Transaction) => Promise<void>;
}

const TransactionForm = ({ data, onSave }: FormProps) => {
  const [form] = useForm();
  const [submitting, setSubmitting] = useState(false);
  const [isExpense, setIsExpense] = useState(true);

  const onSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      await form.validateFields();
    } catch (e) {
      setSubmitting(false);
      return;
    }
    values.amount = `${isExpense ? "-" : ""}${values.amount.amount}`;
    values.amount_currency = values.amount.currency || "CHF";

    try {
      await onSave(values);
    } catch (e) {
      setSubmitting(false);
    }
  };

  const moneyProps: InputNumberProps = {};
  if (isExpense) {
    moneyProps.max = 0;
  } else {
    moneyProps.min = 0;
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      initialValues={{ ...data }}
    >
      <Row>
        <Col span={7}>
          <Form.Item name="amount" label="Amount" rules={[{ required: true }]}>
            <MoneyInput autoFocus {...moneyProps} />
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item label="Type">
            <Radio.Group
              defaultValue="expense"
              onChange={e => {
                setIsExpense(e.target.value === "expense");
              }}
            >
              <Radio.Button value="expense">Expense</Radio.Button>
              <Radio.Button value="income">Income</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        name="set_account"
        label="Account"
        rules={[{ required: true }]}
      >
        <ModelSelect useItems={useAccounts} />
      </Form.Item>
      <Form.Item
        name="set_category"
        label="Category"
        rules={[{ required: true }]}
      >
        <CategorySelect />
      </Form.Item>
      <Form.Item name="set_payee" label="Payee">
        <ModelSelect useItems={usePayees} />
      </Form.Item>
      <Form.Item name="set_tags" label="Tags">
        <ModelSelect useItems={useTags} mode="multiple" />
      </Form.Item>
      <Form.Item name="text" label="Memo">
        <Input />
      </Form.Item>
      <Form.Item name="reference" label="Reference">
        <Input />
      </Form.Item>
      <Form.Item>
        <>
          <Button type="primary" htmlType="submit" loading={submitting}>
            Save Transaction
          </Button>
          <Link to={`/transactions`}>
            <Button>Discard</Button>
          </Link>
        </>
      </Form.Item>
    </Form>
  );
};

export default TransactionForm;
