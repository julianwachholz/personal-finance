import { DeleteFilled } from "@ant-design/icons";
import { message, Spin } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { RouteComponentProps } from "react-router";
import { deletePayee, putPayee, usePayee } from "../../dao/payees";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";
import { confirmDeletePayee } from "./delete";
import PayeeForm from "./Form";

interface DetailParams {
  pk: string;
}

const PayeeEdit = ({
  match,
  location,
  history
}: RouteComponentProps<DetailParams, {}, { back?: number }>) => {
  const [t] = useTranslation("payees");
  const pk = parseInt(match.params.pk, 10);
  const { data: payee, isLoading } = usePayee(pk);

  const [mutate] = useMutation(putPayee, {
    refetchQueries: ["items/payees"]
  });
  const [doDelete] = useMutation(deletePayee, {
    refetchQueries: ["items/payees"]
  });
  useTitle(
    payee && t("payees:edit", "Edit {{ label }}", { label: payee.label })
  );

  if (!payee || isLoading) {
    return <Spin />;
  }

  return (
    <BaseModule
      title={t("payees:edit", "Edit {{ label }}", { label: payee.label })}
      onLeftClick={() => {
        history.go(location.state?.back ?? -2);
      }}
      rightContent={
        <DeleteFilled
          onClick={() => {
            confirmDeletePayee(payee, doDelete, t, history);
          }}
        />
      }
    >
      <PayeeForm
        data={payee}
        onSave={async data => {
          try {
            await mutate(data, { updateQuery: ["item/payees", { pk }] });
            message.success(t("payees:updated", "Payee updated"));
            history.push(`/settings/payees`);
          } catch (e) {
            message.error(t("payees:update_error", "Payee update failed"));
            throw e;
          }
        }}
      />
    </BaseModule>
  );
};

export default PayeeEdit;
