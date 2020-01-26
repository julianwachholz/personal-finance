import { DeleteFilled } from "@ant-design/icons";
import { message, Spin } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { RouteComponentProps } from "react-router";
import {
  deleteTransaction,
  putTransaction,
  useTransaction
} from "../../dao/transactions";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";
import { confirmDeleteTransaction } from "./delete";
import TransactionForm from "./Form";

interface DetailParams {
  pk: string;
}

const TransactionEdit = ({
  match,
  history
}: RouteComponentProps<DetailParams>) => {
  const [t] = useTranslation("transactions");
  const pk = parseInt(match.params.pk, 10);
  const { data: tx, isLoading } = useTransaction(pk, {
    refetchOnWindowFocus: false
  });

  const [mutate] = useMutation(putTransaction, {
    refetchQueries: ["items/transactions"]
  });
  const [doDelete] = useMutation(deleteTransaction, {
    refetchQueries: ["items/transactions"]
  });

  useTitle(t("transactions:edit", "Edit Transaction"));
  return (
    <BaseModule
      title={t("transactions:edit", "Edit Transaction")}
      onLeftClick={() => {
        history.go(-1);
      }}
      rightContent={
        tx ? (
          <DeleteFilled
            onClick={() => {
              confirmDeleteTransaction(tx, doDelete, t, history);
            }}
          />
        ) : (
          undefined
        )
      }
    >
      {tx && !isLoading ? (
        <TransactionForm
          data={tx}
          onSave={async data => {
            try {
              await mutate(data, {
                updateQuery: ["item/transactions", { pk }]
              });
              message.success(t("transactions:updated", "Transaction updated"));
              history.push(`/transactions`);
            } catch (e) {
              message.error(
                t("transactions:update_error", "Transaction update failed")
              );
              throw e;
            }
          }}
        />
      ) : (
        <Spin />
      )}
    </BaseModule>
  );
};

export default TransactionEdit;
