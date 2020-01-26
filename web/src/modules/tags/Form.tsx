import { Button, Form, Input } from "antd";
import React, { useState } from "react";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import ColorSelect from "../../components/form/ColorSelect";
import { Tag } from "../../dao/tags";
import { applyFormErrors } from "../../utils/errors";

interface FormProps {
  data?: Tag;
  onSave: (values: Tag) => Promise<void>;
}

const TagForm = ({ data, onSave }: FormProps) => {
  const [t] = useTranslation("tags");
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
      initialValues={data}
      size={isMobile ? "large" : "middle"}
    >
      <Form.Item
        name="name"
        label={t("tags:name", "Name")}
        wrapperCol={{ sm: 14 }}
        rules={[
          {
            required: true,
            message: t("tags:name_required", "Enter a name")
          }
        ]}
      >
        <Input prefix="#" autoFocus />
      </Form.Item>
      <Form.Item name="color" label={t("tags:color", "Color")}>
        <ColorSelect />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={submitting}
          block={isMobile}
        >
          {data
            ? t("tags:update", "Update Tag")
            : t("tags:create", "Create Tag")}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TagForm;
