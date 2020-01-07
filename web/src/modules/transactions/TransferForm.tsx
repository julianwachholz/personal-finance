import { SwapOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row
} from "antd";
import React, { useState } from "react";
import { useMutation } from "react-query";
import DatePicker from "../../components/form/DatePicker";
import ModelSelect from "../../components/form/ModelSelect";
import MoneyInput from "../../components/form/MoneyInput";
import {
  accountTransfer,
  AccountTransfer,
  useAccounts
} from "../../dao/accounts";

interface TransferFormProps {
  visible: boolean;
  onVisible?: (visible: boolean) => void;
}

const TransferForm = ({ visible, onVisible }: TransferFormProps) => {
  const [form] = Form.useForm();
  const [fromCurrency, setFromCurrency] = useState();
  const [toCurrency, setToCurrency] = useState();
  const [amount, setAmount] = useState(0);
  const [conversion_rate, setRate] = useState(1);
  const [isLoading, setLoading] = useState(false);
  const now = new Date();

  const [transfer] = useMutation(accountTransfer, {
    refetchQueries: ["items/transactions"]
  });

  const needConversion =
    fromCurrency && toCurrency && fromCurrency !== toCurrency;

  return (
    <Modal
      visible={visible}
      title="Balance Transfer"
      maskClosable
      onCancel={() => onVisible?.(false)}
      footer={false}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ date: now, amount, conversion_rate }}
        onValuesChange={({ amount, conversion_rate }) => {
          amount && setAmount(amount);
          conversion_rate && setRate(conversion_rate);
        }}
        onFinish={async values => {
          setLoading(true);
          try {
            await transfer(values as AccountTransfer);
            message.success("Transfer executed");
            onVisible?.(false);
          } catch (e) {
            message.error("Transfer failed");
            console.error(e);
          }
          setLoading(false);
        }}
      >
        <Form.Item name="pk" label="From Account" rules={[{ required: true }]}>
          <ModelSelect
            autoFocus
            useItems={useAccounts}
            onItemSelect={account => {
              setFromCurrency(account.currency);
            }}
          />
        </Form.Item>
        <Form.Item
          name="target"
          label="To Account"
          rules={[{ required: true }]}
        >
          <ModelSelect
            useItems={useAccounts}
            onItemSelect={account => {
              setToCurrency(account.currency);
            }}
          />
        </Form.Item>
        <Row>
          <Col span={10}>
            <Form.Item label="Amount" required>
              <Input.Group compact>
                <Form.Item
                  name="amount"
                  noStyle
                  rules={[{ required: true, type: "number", min: 0 }]}
                >
                  <MoneyInput size="middle" min={0} />
                </Form.Item>
                <Input value={fromCurrency} disabled style={{ width: 50 }} />
              </Input.Group>
            </Form.Item>
          </Col>
          <Col span={14}>
            <Form.Item
              label="Conversion Rate"
              style={{ display: needConversion ? "block" : "none" }}
            >
              <Input.Group compact>
                <Form.Item name="conversion_rate" noStyle>
                  <InputNumber precision={4} step={0.0001} />
                </Form.Item>
                <MoneyInput
                  size="middle"
                  disabled
                  value={amount * conversion_rate}
                  style={{ width: 90 }}
                />
                <Input value={toCurrency} disabled style={{ width: 50 }} />
              </Input.Group>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="text" label="Description">
          <Input />
        </Form.Item>
        <Form.Item name="date" label="Date">
          <DatePicker size="middle" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            icon={<SwapOutlined />}
            htmlType="submit"
            loading={isLoading}
          >
            Transfer
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TransferForm;
