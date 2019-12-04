import { Form, Input } from "antd";
import { FormComponentProps } from "antd/lib/form";
import React from "react";

interface IFormProps extends FormComponentProps {
  initial?: any;
}

const AccountFormComponent: React.FC<IFormProps> = ({ initial, form }) => {
  return (
    <Form layout="horizontal" onSubmit={() => console.log("submit")}>
      <Form.Item label="Name">
        <Input.Group compact>
          {form.getFieldDecorator("icon", {
            initialValue: initial && initial.icon
          })(
            <Input
              placeholder="💵"
              style={{ width: "10%", textAlign: "center" }}
            />
          )}
          {form.getFieldDecorator("name", {
            initialValue: initial && initial.name,
            rules: [{ required: true }]
          })(<Input placeholder="Checking" style={{ width: "90%" }} />)}
        </Input.Group>
      </Form.Item>
      <Form.Item label="Institution">
        {form.getFieldDecorator("institution", {
          initialValue: initial && initial.institution
        })(<Input placeholder="Example Credit Union" />)}
      </Form.Item>
      <Form.Item label="Balance">
        <Input.Group compact>
          {form.getFieldDecorator("balance", {
            initialValue: initial && initial.balance
          })(<Input placeholder="0.00" style={{ width: "90%" }} />)}
          {form.getFieldDecorator("balance_currency", {
            initialValue: initial && initial.balance_currency
          })(
            <Input
              placeholder="USD"
              style={{ width: "10%", textAlign: "center" }}
            />
          )}
        </Input.Group>
      </Form.Item>
    </Form>
  );
};

const AccountForm = Form.create<IFormProps>()(AccountFormComponent);

export default AccountForm;
