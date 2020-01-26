import { Button, Col, Form, Input, Radio, Row, Select } from "antd";
import React, { useState } from "react";
import { BrowserView, isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import CategorySelect from "../../components/form/CategorySelect";
import CurrencySelect from "../../components/form/CurrencySelect";
import MoneyInput from "../../components/form/MoneyInput";
import { Budget, BudgetPeriod } from "../../dao/budgets";
import { useAuth } from "../../utils/AuthProvider";
import { applyFormErrors } from "../../utils/errors";

interface BudgetFormProps {
  data?: Budget;
  onSave: (values: Budget) => Promise<void>;
}

export const BudgetForm = ({ data, onSave }: BudgetFormProps) => {
  const [t] = useTranslation("budgets");
  const { settings } = useAuth();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      await form.validateFields();
      await onSave(values);
    } catch (error) {
      setSubmitting(false);
      applyFormErrors(form, error);
    }
  };

  const defaultValues = {
    period: BudgetPeriod.MONTHLY,
    target_currency: settings?.default_currency,
    is_blacklist: false
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      initialValues={{ ...defaultValues, ...data }}
      size={isMobile ? "large" : "middle"}
    >
      <Form.Item
        name="name"
        label={t("budgets:name", "Name")}
        rules={[
          {
            required: true,
            message: t("budgets:name_required", "Enter a name")
          }
        ]}
        wrapperCol={isMobile ? undefined : { span: 14 }}
      >
        <Input
          placeholder={t("budgets:name_placeholder", "Spending")}
          autoFocus
        />
      </Form.Item>
      <Form.Item
        name="period"
        label={t("budgets:period", "Timeframe")}
        wrapperCol={isMobile ? undefined : { span: 14 }}
      >
        <Select>
          <Select.Option value={BudgetPeriod.WEEKLY}>
            {t("budgets:period_weekly", "Weekly")}
          </Select.Option>
          <Select.Option value={BudgetPeriod.MONTHLY}>
            {t("budgets:period_monthly", "Monthly")}
          </Select.Option>
          <Select.Option value={BudgetPeriod.QUARTERLY}>
            {t("budgets:period_quarterly", "Quarterly")}
          </Select.Option>
          <Select.Option value={BudgetPeriod.YEARLY}>
            {t("budgets:period_yearly", "Yearly")}
          </Select.Option>
        </Select>
      </Form.Item>
      <Row gutter={16}>
        <Col xs={18} sm={4}>
          <Form.Item
            name="target"
            label={t("budgets:target", "Target Amount")}
            rules={[
              {
                required: true,
                message: t("budgets:target_required", "Enter a target amount"),
                type: "number",
                min: 0.01
              }
            ]}
          >
            <MoneyInput
              size={isMobile ? "large" : "middle"}
              fullWidth
              min={0}
            />
          </Form.Item>
        </Col>
        <Col xs={6} sm={8}>
          <Form.Item
            name="target_currency"
            label={t("budgets:currency", "Currency")}
            rules={[
              {
                required: true,
                message: t("budgets:currency_required", "Select a currency")
              }
            ]}
            // help="Transactions with a different currency are not included."
          >
            <CurrencySelect
              dropdownMatchSelectWidth={300}
              dropdownAlign={
                isMobile ? { points: ["tr", "br"], offset: [0, 4] } : undefined
              }
            />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        name="is_blacklist"
        label={t("budgets:category_selection", "Category Selection")}
      >
        <Radio.Group>
          <Radio.Button value={false}>
            {t("budgets:categories_include", "Include selected")}
          </Radio.Button>
          <Radio.Button value={true}>
            {t("budgets:categories_exclude", "Exclude selected")}
          </Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        name="categories"
        label={t("budgets:categories", "Categories")}
        wrapperCol={isMobile ? undefined : { span: 14 }}
      >
        <CategorySelect
          treeCheckable
          showCheckedStrategy="SHOW_ALL"
          size={isMobile ? "large" : "middle"}
        />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={submitting}
          block={isMobile}
        >
          {data
            ? t("budgets:update", "Update Budget")
            : t("budgets:create", "Create Budget")}
        </Button>
        <BrowserView>
          <Link to={`/budgets`}>
            <Button>{t("translation:cancel", "Cancel")}</Button>
          </Link>
        </BrowserView>
      </Form.Item>
    </Form>
  );
};

export default BudgetForm;
