import { message } from "antd";
import React from "react";
import { setQueryData, useMutation } from "react-query";
import { useHistory } from "react-router";
import { postTransaction } from "../../dao/transactions";
import BaseModule from "../base/BaseModule";
import TransactionForm from "./Form";

const TransactionCreate = () => {
  const [mutate] = useMutation(postTransaction, {
    refetchQueries: ["items/transactions"]
  });
  const history = useHistory();

  return (
    <BaseModule title="Create Transaction">
      <TransactionForm
        onSave={async data => {
          try {
            const tx = await mutate(data);
            setQueryData(["item/transactions", { pk: tx.pk }], tx);
            message.success("Transaction created!");
            history.push(`/transactions`);
          } catch (e) {
            message.error("Transaction create failed!");
          }
        }}
      />
    </BaseModule>
  );
};

export default TransactionCreate;
