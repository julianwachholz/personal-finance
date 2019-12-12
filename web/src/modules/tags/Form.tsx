import { Button, Form, Input } from "antd";
import { FormComponentProps } from "antd/lib/form";
import React, { useState } from "react";
import ColorInput from "../../components/form/ColorInput";
import { ITag } from "../../dao/tags";

interface IFormProps extends FormComponentProps {
  data?: ITag;
  onSave: (values: any) => void;
}

const TagFormComponent: React.FC<IFormProps> = ({ data, form, onSave }) => {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const newData = {
          ...values
        };
        onSave(newData);
      }
    });
  };

  return (
    <Form layout="horizontal" onSubmit={onSubmit}>
      <Form.Item label="Name">
        {form.getFieldDecorator("name", {
          initialValue: data && data.name,
          rules: [{ required: true }]
        })(
          <Input placeholder="personal" prefix="#" style={{ width: "50%" }} />
        )}
      </Form.Item>
      <Form.Item label="Color">
        {form.getFieldDecorator("color", {
          initialValue: data && data.color
        })(<ColorInput style={{ width: "50%" }} />)}
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={submitting}>
          Save Tag
        </Button>
      </Form.Item>
    </Form>
  );
};

const TagForm = Form.create<IFormProps>()(TagFormComponent);

export default TagForm;
