import { Button, Form, Input } from "antd";
import { useForm } from "antd/lib/form/util";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Payee } from "../../dao/payees";

interface FormProps {
  data?: Payee;
  onSave: (values: Payee) => void;
}

const PayeeForm = ({ data, onSave }: FormProps) => {
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
        <Input placeholder="Acme Co." />
      </Form.Item>
      <Form.Item>
        <>
          <Button type="primary" htmlType="submit" loading={submitting}>
            Save Payee
          </Button>
          <Link
            to={(data && `/settings/payees/${data.pk}`) ?? `/settings/payees`}
          >
            <Button>Discard</Button>
          </Link>
        </>
      </Form.Item>
    </Form>
  );
};

export default PayeeForm;
