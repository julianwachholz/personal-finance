import { message } from "antd";
import React from "react";
import { useMutation } from "react-query";
import { useHistory } from "react-router";
import { postBudget } from "../../dao/budgets";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";
import BudgetForm from "./Form";

interface BudgetCreateProps {}

export const BudgetCreate = (props: BudgetCreateProps) => {
  const [mutate] = useMutation(postBudget, {
    refetchQueries: ["items/budgets"]
  });
  const history = useHistory();

  useTitle(`Create Budget`);
  return (
    <BaseModule
      title="Create Budget"
      onLeftClick={() => {
        history.go(-1);
      }}
    >
      <BudgetForm
        onSave={async data => {
          try {
            await mutate(data);
            message.success("Budget created");
            history.push(`/budgets`);
          } catch (e) {
            message.error("Budget create failed");
            throw e;
          }
        }}
      />
    </BaseModule>
  );
};

export default BudgetCreate;
