import { Button, Form, Input, Select } from "antd";
import React, { useState } from "react";
import { isMobile } from "react-device-detect";
import CategorySelect from "../../components/form/CategorySelect";
import { Payee } from "../../dao/payees";
import { applyFormErrors } from "../../utils/errors";

interface FormProps {
  data?: Payee;
  onSave: (values: Payee) => Promise<void>;
}

const PayeeForm = ({ data, onSave }: FormProps) => {
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

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      initialValues={{
        type: "business",
        default_category: data?.default_category?.value,
        ...data
      }}
      size={isMobile ? "large" : "middle"}
    >
      <Form.Item
        name="name"
        label="Name"
        wrapperCol={{ sm: 14 }}
        rules={[{ required: true, message: "Enter a name" }]}
      >
        <Input autoFocus />
      </Form.Item>
      <Form.Item name="type" label="Type">
        <Select>
          <Select.Option value="business">Business</Select.Option>
          <Select.Option value="private">Person</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item name="set_default_category" label="Default Category">
        <CategorySelect size="large" />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={submitting}
          block={isMobile}
        >
          Save Payee
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PayeeForm;
