import { message } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { RouteComponentProps } from "react-router";
import { postBudget } from "../../dao/budgets";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";
import BudgetForm from "./Form";

export const BudgetCreate = ({ history }: RouteComponentProps) => {
  const [t] = useTranslation("budgets");
  const [mutate] = useMutation(postBudget, {
    refetchQueries: ["items/budgets"]
  });

  useTitle(t("budgets:create", "Create Budget"));
  return (
    <BaseModule
      title={t("budgets:create", "Create Budget")}
      onLeftClick={() => {
        history.go(-1);
      }}
    >
      <BudgetForm
        onSave={async data => {
          try {
            await mutate(data);
            message.success(t("budgets:created", "Budget created"));
            history.push(`/budgets`);
          } catch (e) {
            message.error(t("budgets:create_error", "Budget create failed"));
            throw e;
          }
        }}
      />
    </BaseModule>
  );
};

export default BudgetCreate;
