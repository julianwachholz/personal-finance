import { Button, Form, Input } from "antd";
import { useForm } from "antd/lib/form/util";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import ColorInput from "../../components/form/ColorInput";
import { Tag } from "../../dao/tags";

interface FormProps {
  data?: Tag;
  onSave: (values: Tag) => void;
}

const TagForm = ({ data, onSave }: FormProps) => {
  const [form] = useForm();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      await form.validateFields();
    } catch (e) {
      setSubmitting(false);
      debugger;
      return;
    }
    const newData = {
      ...values
    };
    onSave(newData);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      initialValues={data}
    >
      <Form.Item name="name" label="Name" required>
        <Input placeholder="personal" prefix="#" />
      </Form.Item>
      <Form.Item name="color" label="Color">
        <ColorInput />
      </Form.Item>
      <Form.Item>
        <>
          <Button type="primary" htmlType="submit" loading={submitting}>
            Save Tag
          </Button>
          <Link to={(data && `/settings/tags/${data.pk}`) ?? `/settings/tags`}>
            <Button>Discard</Button>
          </Link>
        </>
      </Form.Item>
    </Form>
  );
};

export default TagForm;
