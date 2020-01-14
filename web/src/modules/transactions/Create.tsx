import {
  EllipsisOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  SwapOutlined
} from "@ant-design/icons";
import { message } from "antd";
import { Popover } from "antd-mobile";
import React, { useState } from "react";
import { setQueryData, useMutation } from "react-query";
import { useHistory } from "react-router";
import { postTransaction } from "../../dao/transactions";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";
import TransactionForm from "./Form";

const TransactionCreate = () => {
  const [mutate] = useMutation(postTransaction, {
    refetchQueries: ["items/transactions"]
  });
  const history = useHistory();
  const [type, setType] = useState<"expense" | "income">("expense");
  const [visible, setVisible] = useState(false);
  const title = type === "expense" ? "Add Expense" : "Add Income";

  const changeTypeItem = (
    <Popover.Item
      key={type === "expense" ? "income" : "expense"}
      icon={
        type === "expense" ? <PlusCircleOutlined /> : <MinusCircleOutlined />
      }
    >
      {type === "expense" ? "Add Income" : "Add Expense"}
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
              Transfer
            </Popover.Item>
          ]}
          onSelect={item => {
            if (["expense", "income"].includes(item.key)) {
              setType(item.key);
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
            message.success("Transaction created");
            history.push(`/transactions`);
          } catch (e) {
            message.error("Transaction create failed");
            throw e;
          }
        }}
      />
    </BaseModule>
  );
};

export default TransactionCreate;
