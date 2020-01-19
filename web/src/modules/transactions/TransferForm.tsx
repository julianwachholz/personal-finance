import { ArrowRightOutlined, SwapOutlined } from "@ant-design/icons";
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
import { isMobile } from "react-device-detect";
import { useMutation } from "react-query";
import DatePicker from "../../components/form/DatePicker";
import ModelSelect from "../../components/form/ModelSelect";
import MoneyInput from "../../components/form/MoneyInput";
import {
  accountTransfer,
  AccountTransfer,
  useAccounts
} from "../../dao/accounts";
import { applyFormErrors } from "../../utils/errors";

interface TransferFormProps {
  onFinish?: () => void;
}

export const TransferForm = ({ onFinish }: TransferFormProps) => {
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
    <Form
      form={form}
      layout="vertical"
      initialValues={{ datetime: now, conversion_rate }}
      onValuesChange={({ amount, conversion_rate }) => {
        amount && setAmount(amount);
        conversion_rate && setRate(conversion_rate);
      }}
      onFinish={async values => {
        setLoading(true);
        const data: AccountTransfer = {
          pk: values.source.value,
          ...(values as AccountTransfer)
        };
        try {
          await transfer(data);
          message.success("Transfer executed");
          onFinish?.();
        } catch (error) {
          message.error("Transfer failed");
          applyFormErrors(form, error);
        }
        setLoading(false);
      }}
      size={isMobile ? "large" : "middle"}
    >
      <Row gutter={8}>
        <Col span={11}>
          <Form.Item
            name="source"
            label="From Account"
            rules={[{ required: true, message: "Select debit account" }]}
            dependencies={["target"]}
          >
            <ModelSelect
              autoFocus
              useItems={useAccounts}
              onItemSelect={account => {
                setFromCurrency(account.currency);
              }}
            />
          </Form.Item>
        </Col>
        <Col span={2} style={{ textAlign: "center" }}>
          <Form.Item label=" ">
            <ArrowRightOutlined style={{ marginTop: isMobile ? 14 : 10 }} />
          </Form.Item>
        </Col>
        <Col span={11}>
          <Form.Item
            name="target"
            label="To Account"
            dependencies={["source"]}
            rules={[
              {
                required: true,
                message: "Select credit account"
              },
              {
                validator(rule, value) {
                  if (
                    value &&
                    value.value === form.getFieldValue("source").value
                  ) {
                    return Promise.reject("Select a different account");
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <ModelSelect
              useItems={useAccounts}
              onItemSelect={account => {
                setToCurrency(account.currency);
              }}
              dropdownAlign={
                isMobile ? { points: ["tr", "br"], offset: [0, 4] } : undefined
              }
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col xs={24} sm={10}>
          <Form.Item label="Amount" required>
            <Input.Group compact>
              <Form.Item
                name="amount"
                noStyle
                rules={[
                  {
                    required: true,
                    type: "number",
                    min: 0.01,
                    message: "Must be more than 0"
                  }
                ]}
              >
                <MoneyInput
                  size={isMobile ? "large" : "middle"}
                  min={0}
                  style={isMobile ? { width: "auto" } : undefined}
                />
              </Form.Item>
              <Input value={fromCurrency} disabled style={{ width: 60 }} />
            </Input.Group>
          </Form.Item>
        </Col>
        <Col xs={24} sm={14}>
          <Form.Item
            label="Conversion Rate"
            style={{ display: needConversion ? "block" : "none" }}
            required
          >
            <Input.Group compact>
              <Form.Item
                name="conversion_rate"
                noStyle
                rules={[
                  {
                    required: needConversion,
                    message: "Enter the conversion rate",
                    type: "number",
                    min: 0.0001
                  }
                ]}
              >
                <InputNumber precision={4} step={0.0001} />
              </Form.Item>
              <MoneyInput
                size={isMobile ? "large" : "middle"}
                disabled
                value={amount * conversion_rate}
                style={{ width: 90 }}
              />
              <Input value={toCurrency} disabled style={{ width: 60 }} />
            </Input.Group>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item name="datetime" label="Date">
        <DatePicker size="middle" />
      </Form.Item>
      <Form.Item name="text" label="Description">
        <Input />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          icon={<SwapOutlined />}
          htmlType="submit"
          loading={isLoading}
          block={isMobile}
        >
          Transfer
        </Button>
      </Form.Item>
    </Form>
  );
};

interface TransferModalProps {
  visible: boolean;
  onVisible: (visible: boolean) => void;
}

export const TransferModal = ({ visible, onVisible }: TransferModalProps) => (
  <Modal
    visible={visible}
    title="Balance Transfer"
    onCancel={() => onVisible(false)}
    footer={false}
  >
    <TransferForm onFinish={() => onVisible(false)} />
  </Modal>
);
