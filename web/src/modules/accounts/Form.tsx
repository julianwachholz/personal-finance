import { Button, Form, Input } from "antd";
import { FormComponentProps } from "antd/lib/form";
import React from "react";
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
        onSave(values);
      }
    });
  };

  return (
    <Form layout="horizontal" onSubmit={onSubmit}>
      <Form.Item label="Name">
        <Input.Group compact>
          {form.getFieldDecorator("icon", {
            initialValue: data && data.icon
          })(
            <Input
              placeholder="💵"
              style={{ width: "10%", textAlign: "center" }}
            />
          )}
          {form.getFieldDecorator("name", {
            initialValue: data && data.name,
            rules: [{ required: true }]
          })(<Input placeholder="Checking" style={{ width: "90%" }} />)}
        </Input.Group>
      </Form.Item>
      <Form.Item label="Institution">
        {form.getFieldDecorator("institution", {
          initialValue: data && data.institution
        })(<Input placeholder="Example Credit Union" />)}
      </Form.Item>
      <Form.Item label="Balance">
        <Input.Group compact>
          {form.getFieldDecorator("balance", {
            initialValue: data && data.balance
          })(<Input placeholder="0.00" style={{ width: "90%" }} />)}
          {form.getFieldDecorator("balance_currency", {
            initialValue: data && data.balance_currency
          })(
            <Input
              placeholder="USD"
              style={{ width: "10%", textAlign: "center" }}
            />
          )}
        </Input.Group>
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
