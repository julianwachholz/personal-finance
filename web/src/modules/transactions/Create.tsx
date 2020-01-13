import { message } from "antd";
import React from "react";
import { useMutation } from "react-query";
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
    >
      <TransactionForm
        onSave={async data => {
          try {
            await mutate(data);
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
