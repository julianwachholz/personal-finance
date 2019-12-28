import { message, Spin } from "antd";
import React from "react";
import { useMutation } from "react-query";
import { RouteComponentProps, useHistory } from "react-router";
import { putPayee, usePayee } from "../../dao/payees";
import BaseModule from "../base/BaseModule";
import PayeeForm from "./Form";

interface DetailParams {
  pk: string;
}

const PayeeEdit = ({ match }: RouteComponentProps<DetailParams>) => {
  const pk = parseInt(match.params.pk, 10);
  const { data, isLoading } = usePayee(pk);

  const [mutate] = useMutation(putPayee, {
    refetchQueries: ["items/payees"]
  });
  const history = useHistory();

  if (!data || isLoading) {
    return <Spin />;
  }

  return (
    <BaseModule title={`Edit ${data.name}`}>
      <PayeeForm
        data={data}
        onSave={async data => {
          try {
            await mutate(
              { pk, ...data },
              { updateQuery: ["item/payees", { pk }] }
            );
            message.success("Payee updated!");
            history.push(`/settings/payees/${pk}`);
          } catch (e) {
            message.error("Payee update failed!");
          }
        }}
      />
    </BaseModule>
  );
};

export default PayeeEdit;
