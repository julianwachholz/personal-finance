import { Button, Col, Form, Input, Radio, Row, Select } from "antd";
import React, { useState } from "react";
import { BrowserView, isMobile } from "react-device-detect";
import { Link } from "react-router-dom";
import CategorySelect from "../../components/form/CategorySelect";
import CurrencySelect from "../../components/form/CurrencySelect";
import MoneyInput from "../../components/form/MoneyInput";
import { Budget, BudgetPeriod, PERIOD_CHOICES } from "../../dao/budgets";
import { useAuth } from "../../utils/AuthProvider";

interface BudgetFormProps {
  data?: Budget;
  onSave: (values: Budget) => Promise<void>;
}

export const BudgetForm = ({ data, onSave }: BudgetFormProps) => {
  const { settings } = useAuth();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const onSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      await form.validateFields();
      await onSave(values);
    } catch (e) {
      setSubmitting(false);
      return;
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
        label="Name"
        rules={[{ required: true, message: "Enter a name" }]}
        wrapperCol={isMobile ? undefined : { span: 14 }}
      >
        <Input placeholder="Spending" autoFocus />
      </Form.Item>
      <Form.Item
        name="period"
        label="Timeframe"
        wrapperCol={isMobile ? undefined : { span: 14 }}
      >
        <Select>
          {PERIOD_CHOICES.map(([value, label]) => (
            <Select.Option key={value} value={value}>
              {label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Row gutter={16}>
        <Col xs={18} sm={4}>
          <Form.Item
            name="target"
            label="Target Amount"
            rules={[{ required: true, message: "Enter a target amount" }]}
          >
            <MoneyInput size={isMobile ? "large" : "middle"} fullWidth />
          </Form.Item>
        </Col>
        <Col xs={6} sm={8}>
          <Form.Item
            name="target_currency"
            label="Currency"
            rules={[{ required: true, message: "Select a currency" }]}
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
      <Form.Item name="is_blacklist" label="Category Selection">
        <Radio.Group>
          <Radio.Button value={false}>Include selected</Radio.Button>
          <Radio.Button value={true}>Exclude selected</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        name="categories"
        label="Categories"
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
          {data?.pk ? "Save" : "Create"} Budget
        </Button>
        <BrowserView>
          <Link to={`/budgets`}>
            <Button>Discard</Button>
          </Link>
        </BrowserView>
      </Form.Item>
    </Form>
  );
};

export default BudgetForm;
