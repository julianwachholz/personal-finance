import { Button, Col, Form, Input, Row } from "antd";
import { useForm } from "antd/lib/form/util";
import React, { useEffect, useState } from "react";
import CategorySelect from "../../components/form/CategorySelect";
import DatePicker from "../../components/form/DatePicker";
import ModelSelect from "../../components/form/ModelSelect";
import MoneyInput from "../../components/form/MoneyInput";
import { useAccounts } from "../../dao/accounts";
import { ModelWithLabel } from "../../dao/base";
import { usePayees } from "../../dao/payees";
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

    if (!tx.set_category) {
      tx.set_category = null;
    }
    if (!tx.set_payee) {
      tx.set_payee = null;
    }

    try {
      await onSave(tx);
    } catch (e) {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (data) {
      const mapped = Object.entries(data).map(([key, value]) => {
        if (["account", "category", "payee"].includes(key)) {
          return [`set_${key}`, value?.pk];
        }
        if (key === "tags") {
          return ["set_tags", value.map((t: ModelWithLabel) => t.pk)];
        }
        return [key, value];
      });
      form.setFieldsValue(Object.fromEntries(mapped));
    }
  }, [data, form]);

  useEffect(() => {
    if (type === "expense") {
      form.setFieldsValue({
        type: "expense",
        set_account: settings?.default_debit_account
      });
    }
    if (type === "income") {
      form.setFieldsValue({
        type: "income",
        set_account: settings?.default_credit_account,
        set_category: settings?.default_credit_category
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
        name="set_account"
        label="Account"
        rules={[{ required: true, message: "Select an account" }]}
      >
        <ModelSelect useItems={useAccounts} />
      </Form.Item>
      <Form.Item name="set_payee" label="Payee">
        <ModelSelect
          allowClear
          useItems={usePayees}
          onItemSelect={payee => {
            if (form && payee.default_category) {
              form.setFieldsValue({
                set_category: payee.default_category.pk
              });
            }
          }}
        />
      </Form.Item>
      <Form.Item name="set_category" label="Category">
        <CategorySelect allowClear size="large" />
      </Form.Item>
      <Form.Item name="text" label="Description">
        <Input />
      </Form.Item>
      <Form.Item name="set_tags" label="Tags">
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
