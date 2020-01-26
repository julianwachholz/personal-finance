import {
  EllipsisOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  SwapOutlined
} from "@ant-design/icons";
import { message } from "antd";
import { Popover } from "antd-mobile";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { setQueryData, useMutation } from "react-query";
import { RouteComponentProps } from "react-router";
import { postTransaction } from "../../dao/transactions";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";
import TransactionForm from "./Form";

const TransactionCreate = ({ history }: RouteComponentProps) => {
  const [t] = useTranslation("transactions");
  const [mutate] = useMutation(postTransaction, {
    refetchQueries: ["items/transactions"]
  });
  const [type, setType] = useState<"expense" | "income">("expense");
  const [visible, setVisible] = useState(false);

  const title =
    type === "expense"
      ? t("transactions:add_expense", "Add Expense")
      : t("transactions:add_income", "Add Income");

  const changeTypeItem = (
    <Popover.Item
      key={type === "expense" ? "income" : "expense"}
      icon={
        type === "expense" ? <PlusCircleOutlined /> : <MinusCircleOutlined />
      }
    >
      {type === "expense"
        ? t("transactions:add_income", "Add Income")
        : t("transactions:add_expense", "Add Expense")}
    </Popover.Item>
  );

  useTitle(title);
  return (
    <BaseModule
      title={title}
      onLeftClick={() => {
        history.go(-1);
      }}
      rightContent={
        <Popover
          mask
          visible={visible}
          onVisibleChange={setVisible}
          overlay={[
            changeTypeItem,
            <Popover.Item key="transfer" icon={<SwapOutlined />}>
              {t("transactions:transfer_label", "Transfer")}
            </Popover.Item>
          ]}
          onSelect={item => {
            if (["expense", "income"].includes(item.key)) {
              setType(item.key);
            }
            if (item.key === "transfer") {
              history.replace(`/transactions/transfer`);
            }
            setVisible(false);
          }}
        >
          <EllipsisOutlined />
        </Popover>
      }
    >
      <TransactionForm
        type={type}
        onSave={async data => {
          try {
            const tx = await mutate(data);
            setQueryData(["item/transactions", { pk: tx.pk }], tx);
            message.success(t("transactions:created", "Transaction created"));
            history.push(`/transactions`);
          } catch (e) {
            message.error(
              t("transactions:create_error", "Transaction create failed")
            );
            throw e;
          }
        }}
      />
    </BaseModule>
  );
};

export default TransactionCreate;
