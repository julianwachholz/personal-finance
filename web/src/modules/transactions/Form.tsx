import { Button, Col, Form, Input, Row } from "antd";
import { useForm } from "antd/lib/form/util";
import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import CategorySelect from "../../components/form/CategorySelect";
import DatePicker from "../../components/form/DatePicker";
import ModelSelect from "../../components/form/ModelSelect";
import MoneyInput from "../../components/form/MoneyInput";
import { useAccounts } from "../../dao/accounts";
import { Payee, postPayee, usePayees } from "../../dao/payees";
import { useTags } from "../../dao/tags";
import { Transaction } from "../../dao/transactions";
import { useAuth } from "../../utils/AuthProvider";

interface FormProps {
  type?: "expense" | "income";
  data?: Transaction;
  onSave: (values: Transaction) => Promise<void>;
}

const TransactionForm = ({ type, data, onSave }: FormProps) => {
  const { settings } = useAuth();
  const [form] = useForm();
  const [submitting, setSubmitting] = useState(false);
  const [createPayee] = useMutation(postPayee);

  const quickCreatePayee = async (name: string) => {
    form?.setFieldsValue({
      payee: { value: "0", label: `Creating "${name}"...` }
    });
    const payee = await createPayee({ name } as Payee);
    form?.setFieldsValue({ payee: { value: payee.pk, label: payee.label } });
  };

  const onSubmit = async (tx: any) => {
    setSubmitting(true);
    try {
      await form.validateFields();
    } catch (e) {
      setSubmitting(false);
      return;
    }

    const isNew = !tx.pk;
    if (isNew && tx.type === "expense" && tx.amount[0] !== "-") {
      tx.amount = `-${tx.amount}`;
    }
    if (!tx.category) {
      tx.category = null;
    }
    if (!tx.payee) {
      tx.payee = null;
    }

    try {
      await onSave(tx);
    } catch (e) {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    }
  }, [data, form]);

  useEffect(() => {
    if (type === "expense") {
      form.setFieldsValue({
        type: "expense",
        account: settings?.default_debit_account
      });
    }
    if (type === "income") {
      form.setFieldsValue({
        type: "income",
        account: settings?.default_credit_account,
        category: settings?.default_credit_category
      });
    }
  }, [type, form, settings]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      initialValues={{
        datetime: new Date(),
        ...data
      }}
      size="large"
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="amount"
            label="Amount"
            rules={[{ required: true, message: "Enter an amount" }]}
          >
            <MoneyInput autoFocus fullWidth size="large" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="datetime"
            label="Date"
            rules={[{ required: true, message: "Enter a date" }]}
          >
            <DatePicker />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        name="account"
        label="Account"
        rules={[{ required: true, message: "Select an account" }]}
      >
        <ModelSelect useItems={useAccounts} />
      </Form.Item>
      <Form.Item name="payee" label="Payee">
        <ModelSelect
          allowClear
          defaultActiveFirstOption
          useItems={usePayees}
          createItem={quickCreatePayee}
          onItemSelect={payee => {
            if (form && payee.default_category) {
              form.setFieldsValue({
                category: payee.default_category
              });
            }
          }}
        />
      </Form.Item>
      <Form.Item name="category" label="Category">
        <CategorySelect allowClear size="large" />
      </Form.Item>
      <Form.Item name="text" label="Description">
        <Input />
      </Form.Item>
      <Form.Item name="tags" label="Tags">
        <ModelSelect useItems={useTags} mode="multiple" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={submitting} block>
          {data?.pk
            ? "Update Transaction"
            : type === "income"
            ? "Save Income"
            : "Save Expense"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TransactionForm;
