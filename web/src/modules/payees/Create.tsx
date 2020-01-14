import { message } from "antd";
import React from "react";
import { setQueryData, useMutation } from "react-query";
import { useHistory } from "react-router";
import { postPayee } from "../../dao/payees";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";
import PayeeForm from "./Form";

const PayeeCreate = () => {
  const [mutate] = useMutation(postPayee, {
    refetchQueries: ["items/payees"]
  });
  const history = useHistory();

  useTitle(`Create Payee`);
  return (
    <BaseModule
      title="Create Payee"
      onLeftClick={() => {
        history.go(-1);
      }}
    >
      <PayeeForm
        onSave={async data => {
          try {
            const tag = await mutate(data);
            setQueryData(["item/payees", { pk: tag.pk }], tag);
            message.success("Payee created");
            history.push(`/settings/payees`);
          } catch (e) {
            message.error("Payee create failed");
            throw e;
          }
        }}
      />
    </BaseModule>
  );
};

export default PayeeCreate;
