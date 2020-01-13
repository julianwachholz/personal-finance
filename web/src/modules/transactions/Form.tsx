import { Form, Input } from "antd";
import { Button } from "antd-mobile";
import { useForm } from "antd/lib/form/util";
import React, { useState } from "react";
import CategorySelect from "../../components/form/CategorySelect";
import ModelSelect from "../../components/form/ModelSelect";
import MoneyInput from "../../components/form/MoneyInput";
import { useAccounts } from "../../dao/accounts";
import { usePayees } from "../../dao/payees";
import { useTags } from "../../dao/tags";
import { Transaction } from "../../dao/transactions";
import { useAuth } from "../../utils/AuthProvider";

interface FormProps {
  data?: Transaction;
  onSave: (values: Transaction) => Promise<void>;
}

const TransactionForm = ({ data, onSave }: FormProps) => {
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

  const defaultValues = {
    type: "expense",
    set_account: settings?.default_debit_account
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      initialValues={{ ...defaultValues, ...data }}
    >
      <Form.Item
        name="amount"
        label="Amount"
        rules={[{ required: true, message: "Enter an amount" }]}
      >
        <MoneyInput autoFocus fullWidth size="middle" />
      </Form.Item>
      <Form.Item
        name="set_account"
        label="Account"
        rules={[{ required: true }]}
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
        <CategorySelect allowClear size="middle" />
      </Form.Item>
      <Form.Item name="text" label="Description">
        <Input />
      </Form.Item>
      <Form.Item name="set_tags" label="Tags">
        <ModelSelect useItems={useTags} mode="multiple" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" onClick={form.submit} loading={submitting}>
          Save Transaction
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TransactionForm;
