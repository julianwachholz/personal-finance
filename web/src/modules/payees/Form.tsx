import { Button, Form, Input, Select } from "antd";
import React, { useState } from "react";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import CategorySelect from "../../components/form/CategorySelect";
import { Payee } from "../../dao/payees";
import { applyFormErrors } from "../../utils/errors";

interface FormProps {
  data?: Payee;
  onSave: (values: Payee) => Promise<void>;
}

const PayeeForm = ({ data, onSave }: FormProps) => {
  const [t] = useTranslation("payees");
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
        label={t("payees:name", "Name")}
        wrapperCol={{ sm: 14 }}
        rules={[
          {
            required: true,
            message: t("payees:name_required", "Enter a name")
          }
        ]}
      >
        <Input autoFocus />
      </Form.Item>
      <Form.Item name="type" label={t("payees:type", "Type")}>
        <Select>
          <Select.Option value="business">
            {t("payees:type_business", "Business")}
          </Select.Option>
          <Select.Option value="private">
            {t("payees:type_person", "Person")}
          </Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="set_default_category"
        label={t("payees:default_category", "Default Category")}
      >
        <CategorySelect size="large" />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={submitting}
          block={isMobile}
        >
          {data
            ? t("payees:update", "Update Payee")
            : t("payees:create", "Create Payee")}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PayeeForm;
