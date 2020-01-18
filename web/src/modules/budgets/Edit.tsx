import { DeleteFilled } from "@ant-design/icons";
import { message, Spin } from "antd";
import React from "react";
import { useMutation } from "react-query";
import { RouteComponentProps, useHistory } from "react-router";
import { deleteBudget, putBudget, useBudget } from "../../dao/budgets";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";
import { confirmDeleteBudget } from "./delete";
import { BudgetForm } from "./Form";

interface DetailParams {
  pk: string;
}

const BudgetEdit = ({ match }: RouteComponentProps<DetailParams>) => {
  const pk = parseInt(match.params.pk, 10);
  const { data: budget, isLoading } = useBudget(pk);

  const [mutate] = useMutation(putBudget, {
    refetchQueries: ["items/budgets"]
  });
  const [doDelete] = useMutation(deleteBudget);
  const history = useHistory();
  useTitle(budget && `Edit ${budget.label}`);

  if (!budget || isLoading) {
    return <Spin />;
  }

  return (
    <BaseModule
      title={`Edit ${budget.label}`}
      onLeftClick={() => {
        history.go(-1);
      }}
      rightContent={
        <DeleteFilled
          onClick={() => {
            confirmDeleteBudget(budget, doDelete, history);
          }}
        />
      }
    >
      <BudgetForm
        data={budget}
        onSave={async data => {
          try {
            await mutate(
              { pk, ...data }
              //   { updateQuery: ["item/accounts", { pk }] }
            );
            message.success("Budget updated");
            history.push(`/budgets`);
          } catch (e) {
            message.error("Budget update failed");
            throw e;
          }
        }}
      />
    </BaseModule>
  );
};

export default BudgetEdit;
