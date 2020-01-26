import { Button, Col, Form, Input, Row } from "antd";
import { useForm } from "antd/lib/form/util";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import CategorySelect from "../../components/form/CategorySelect";
import DatePicker from "../../components/form/DatePicker";
import ModelSelect from "../../components/form/ModelSelect";
import MoneyInput from "../../components/form/MoneyInput";
import { useAccounts } from "../../dao/accounts";
import { Payee, postPayee, usePayees } from "../../dao/payees";
import { postTag, Tag, useTags } from "../../dao/tags";
import { Transaction } from "../../dao/transactions";
import { useAuth } from "../../utils/AuthProvider";
import { applyFormErrors } from "../../utils/errors";

interface FormProps {
  type?: "expense" | "income";
  data?: Transaction;
  onSave: (values: Transaction) => Promise<void>;
}

const TransactionForm = ({ type, data, onSave }: FormProps) => {
  const [t] = useTranslation("transactions");
  const { settings } = useAuth();
  const [form] = useForm();
  const [submitting, setSubmitting] = useState(false);
  const [createPayee] = useMutation(postPayee);
  const [createTag] = useMutation(postTag);

  const quickCreatePayee = async (name: string) => {
    form?.setFieldsValue({
      payee: {
        value: "0",
        label: t(
          "translation:inline.quick_creating",
          'Creating "{{ name }}"...',
          { name }
        )
      }
    });
    const payee = await createPayee({ name } as Payee);
    form?.setFieldsValue({ payee: { value: payee.pk, label: payee.label } });
  };
  const quickCreateTag = async (name: string) => {
    const tags = form
      .getFieldValue("tags")
      .filter((tag: any) => tag.value !== "0");

    const loadingTags = [
      ...tags,
      {
        value: "0",
        label: t(
          "translation:inline.quick_creating",
          'Creating "{{ name }}"...',
          { name }
        )
      }
    ];

    form?.setFieldsValue({ tags: loadingTags });
    const tag = await createTag({ name } as Tag);
    tags.push({ value: tag.pk, label: tag.label });
    form?.setFieldsValue({ tags });
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
    } catch (error) {
      setSubmitting(false);
      applyFormErrors(form, error);
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
            label={t("transactions:amount", "Amount")}
            rules={[
              {
                required: true,
                message: t("transactions:amount_required", "Enter an amount")
              }
            ]}
          >
            <MoneyInput autoFocus fullWidth size="large" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="datetime"
            label={t("transactions:date", "Date")}
            rules={[
              {
                required: true,
                message: t("transactions:date_required", "Enter a date")
              }
            ]}
          >
            <DatePicker />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        name="account"
        label={t("transactions:account", "Account")}
        rules={[
          {
            required: true,
            message: t("transactions:account_required", "Select an account")
          }
        ]}
      >
        <ModelSelect useItems={useAccounts} />
      </Form.Item>
      <Form.Item name="payee" label={t("transactions:payee", "Payee")}>
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
      <Form.Item name="category" label={t("transactions:category", "Category")}>
        <CategorySelect allowClear size="large" />
      </Form.Item>
      <Form.Item
        name="text"
        label={t("transactions:description", "Description")}
      >
        <Input />
      </Form.Item>
      <Form.Item name="tags" label={t("transactions:tags", "Tags")}>
        <ModelSelect
          useItems={useTags}
          mode="multiple"
          createItem={quickCreateTag}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={submitting} block>
          {data
            ? t("transactions:update", "Update Transaction")
            : type === "income"
            ? t("transactions:create_income", "Save Income")
            : t("transactions:create_expense", "Save Expense")}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TransactionForm;
