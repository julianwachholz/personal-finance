import { DeleteFilled } from "@ant-design/icons";
import { message, Spin } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { RouteComponentProps } from "react-router";
import { deleteBudget, putBudget, useBudget } from "../../dao/budgets";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";
import { confirmDeleteBudget } from "./delete";
import { BudgetForm } from "./Form";

interface DetailParams {
  pk: string;
}

const BudgetEdit = ({ match, history }: RouteComponentProps<DetailParams>) => {
  const [t] = useTranslation("budgets");
  const pk = parseInt(match.params.pk, 10);
  const { data: budget, isLoading } = useBudget(pk);

  const [mutate] = useMutation(putBudget, {
    refetchQueries: ["items/budgets"]
  });
  const [doDelete] = useMutation(deleteBudget);

  useTitle(
    budget && t("budgets:edit", "Edit {{ label }}", { label: budget.label })
  );

  if (!budget || isLoading) {
    return <Spin />;
  }

  return (
    <BaseModule
      title={t("budgets:edit", "Edit {{ label }}", { label: budget.label })}
      onLeftClick={() => {
        history.go(-1);
      }}
      rightContent={
        <DeleteFilled
          onClick={() => {
            confirmDeleteBudget(budget, doDelete, t, history);
          }}
        />
      }
    >
      <BudgetForm
        data={budget}
        onSave={async data => {
          try {
            await mutate({ pk, ...data });
            message.success(t("budgets:updated", "Budget updated"));
            history.push(`/budgets`);
          } catch (e) {
            message.error(t("budgets:update_error", "Budget update failed"));
            throw e;
          }
        }}
      />
    </BaseModule>
  );
};

export default BudgetEdit;
