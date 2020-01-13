import {
  EllipsisOutlined,
  PlusCircleOutlined,
  SwapOutlined
} from "@ant-design/icons";
import { message } from "antd";
import { Popover } from "antd-mobile";
import React from "react";
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

  useTitle(`Add Expense`);
  return (
    <BaseModule
      title="Add Expense"
      onLeftClick={() => {
        history.go(-1);
      }}
      rightContent={
        <Popover
          mask
          overlay={[
            <Popover.Item key="income" icon={<PlusCircleOutlined />}>
              Add Income
            </Popover.Item>,
            <Popover.Item key="transfer" icon={<SwapOutlined />}>
              Transfer
            </Popover.Item>
          ]}
          onSelect={item => {
            console.log("overlay select", item.key);
          }}
        >
          <EllipsisOutlined />
        </Popover>
      }
    >
      <TransactionForm
        onSave={async data => {
          try {
            const tx = await mutate(data);
            setQueryData(["item/transactions", { pk: tx.pk }], tx);
            message.success("Transaction created!");
            history.push(`/transactions`);
          } catch (e) {
            message.error("Transaction create failed!");
            throw e;
          }
        }}
      />
    </BaseModule>
  );
};

export default TransactionCreate;
