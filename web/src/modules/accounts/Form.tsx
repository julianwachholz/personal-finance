import { Button, Col, Form, Input, Row } from "antd";
import { FormComponentProps } from "antd/lib/form";
import React from "react";
import MoneyInput from "../../components/form/MoneyInput";
import { IAccount } from "../../dao/accounts";

interface IFormProps extends FormComponentProps {
  data?: IAccount;
  onSave: (values: any) => void;
}

const AccountFormComponent: React.FC<IFormProps> = ({ data, form, onSave }) => {
  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const newData = {
          ...values,
          balance: values.balance.amount,
          balance_currency: values.balance.currency
        };
        onSave(newData);
      }
    });
  };

  const balance = data && {
    amount: data.balance,
    currency: data.balance_currency
  };

  return (
    <Form layout="horizontal" onSubmit={onSubmit}>
      <Row gutter={16}>
        <Col span={2}>
          <Form.Item label="Icon">
            {form.getFieldDecorator("icon", {
              initialValue: data && data.icon
            })(<Input placeholder="💵" style={{ textAlign: "center" }} />)}
          </Form.Item>
        </Col>
        <Col span={10}>
          <Form.Item label="Name">
            {form.getFieldDecorator("name", {
              initialValue: data && data.name,
              rules: [{ required: true }]
            })(<Input placeholder="Checking" style={{ width: "90%" }} />)}
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label="Institution">
        {form.getFieldDecorator("institution", {
          initialValue: data && data.institution
        })(<Input placeholder="Example Credit Union" />)}
      </Form.Item>
      <Form.Item label="Balance">
        {form.getFieldDecorator("balance", {
          initialValue: balance,
          rules: [{ required: true, message: "Please enter a balance." }]
        })(<MoneyInput />)}
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save Account
        </Button>
      </Form.Item>
    </Form>
  );
};

const AccountForm = Form.create<IFormProps>()(AccountFormComponent);

export default AccountForm;
