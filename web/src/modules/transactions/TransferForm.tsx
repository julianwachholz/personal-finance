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
import { useTranslation } from "react-i18next";
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
  const [t] = useTranslation("transactions");
  const [form] = Form.useForm();
  const [fromCurrency, setFromCurrency] = useState();
  const [toCurrency, setToCurrency] = useState();
  const [amount, setAmount] = useState(0);
  const [conversion_rate, setRate] = useState(1);
  const [isLoading, setLoading] = useState(false);
  const now = new Date();

  const [transfer] = useMutation(accountTransfer, {
    refetchQueries: ["items/transactions", "items/accounts"]
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
          message.success(t("transactions:transfer.done", "Transfer executed"));
          onFinish?.();
        } catch (error) {
          message.error(t("transactions:transfer.error", "Transfer failed"));
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
            label={t("transactions:transfer.from_account", "From Account")}
            rules={[
              {
                required: true,
                message: t(
                  "transactions:transfer.from_account_required",
                  "Select debit account"
                )
              }
            ]}
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
            label={t("transactions:transfer.to_account", "To Account")}
            dependencies={["source"]}
            rules={[
              {
                required: true,
                message: t(
                  "transactions:transfer.to_account_required",
                  "Select credit account"
                )
              },
              {
                validator(rule, value) {
                  if (
                    value &&
                    value.value === form.getFieldValue("source").value
                  ) {
                    return Promise.reject(
                      t(
                        "transactions:transfer.select_other_account",
                        "Select a different account"
                      )
                    );
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
          <Form.Item label={t("transactions:amount", "Amount")} required>
            <Input.Group compact>
              <Form.Item
                name="amount"
                noStyle
                rules={[
                  {
                    required: true,
                    type: "number",
                    min: 0.01,
                    message: t(
                      "transactions:amount_required",
                      "Must be more than 0"
                    )
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
            label={t("transactions:transfer.exchange_rate", "Exchange Rate")}
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
                    message: t(
                      "transactions:transfer.exchange_rate_required",
                      "Enter the exchange rate"
                    ),
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
      <Form.Item name="datetime" label={t("transactions:date", "Date")}>
        <DatePicker size="middle" />
      </Form.Item>
      <Form.Item
        name="text"
        label={t("transactions:description", "Description")}
      >
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
          {t("transactions:transfer.submit", "Transfer")}
        </Button>
      </Form.Item>
    </Form>
  );
};

interface TransferModalProps {
  visible: boolean;
  onVisible: (visible: boolean) => void;
}

export const TransferModal = ({ visible, onVisible }: TransferModalProps) => {
  const [t] = useTranslation("transactions");
  return (
    <Modal
      visible={visible}
      title={t("transactions:transfer.title", "Balance Transfer")}
      onCancel={() => onVisible(false)}
      footer={false}
    >
      <TransferForm onFinish={() => onVisible(false)} />
    </Modal>
  );
};
