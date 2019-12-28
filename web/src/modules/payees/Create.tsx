import { message } from "antd";
import React from "react";
import { setQueryData, useMutation } from "react-query";
import { useHistory } from "react-router";
import { postPayee } from "../../dao/payees";
import BaseModule from "../base/BaseModule";
import PayeeForm from "./Form";

const PayeeCreate = () => {
  const [mutate] = useMutation(postPayee, {
    refetchQueries: ["items/payees"]
  });
  const history = useHistory();

  return (
    <BaseModule title="Create Payee">
      <PayeeForm
        onSave={async data => {
          try {
            const payee = await mutate(data);
            setQueryData(["item/payees", { pk: payee.pk }], payee);
            message.success("Payee created!");
            history.push(`/settings/payees/${payee.pk}`);
          } catch (e) {
            message.error("Payee create failed!");
          }
        }}
      />
    </BaseModule>
  );
};

export default PayeeCreate;
