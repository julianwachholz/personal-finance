import { message } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { setQueryData, useMutation } from "react-query";
import { RouteComponentProps } from "react-router";
import { postPayee } from "../../dao/payees";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";
import PayeeForm from "./Form";

const PayeeCreate = ({ history }: RouteComponentProps) => {
  const [t] = useTranslation("payees");
  const [mutate] = useMutation(postPayee, {
    refetchQueries: ["items/payees"]
  });

  useTitle(t("payees:create", "Create Payee"));
  return (
    <BaseModule
      title={t("payees:create", "Create Payee")}
      onLeftClick={() => {
        history.go(-1);
      }}
    >
      <PayeeForm
        onSave={async data => {
          try {
            const tag = await mutate(data);
            setQueryData(["item/payees", { pk: tag.pk }], tag);
            message.success(t("payees:created", "Payee created"));
            history.push(`/settings/payees`);
          } catch (e) {
            message.error(t("payees:create_error", "Payee create failed"));
            throw e;
          }
        }}
      />
    </BaseModule>
  );
};

export default PayeeCreate;
