import { message, Spin } from "antd";
import React from "react";
import { useMutation } from "react-query";
import { RouteComponentProps, useHistory } from "react-router";
import { putAccount, useAccount } from "../../dao/accounts";
import BaseModule from "../base/BaseModule";
import AccountForm from "./Form";

interface IDetailParams {
  pk: string;
}
const AccountEdit: React.FC<RouteComponentProps<IDetailParams>> = ({
  match
}) => {
  const pk = parseInt(match.params.pk, 10);
  const { data, isLoading } = useAccount(pk);

  const [mutate] = useMutation(putAccount, {
    refetchQueries: ["Accounts"]
  });
  const history = useHistory();

  if (!data || isLoading) {
    return <Spin />;
  }

  return (
    <BaseModule title={`Edit ${data.label}`}>
      <AccountForm
        data={data}
        onSave={async data => {
          try {
            await mutate({ pk, ...data }, { updateQuery: ["Account", { pk }] });
            message.success("Account updated!");
            history.push(`/accounts/${pk}`);
          } catch (e) {
            message.error("Account update failed!");
          }
        }}
      />
    </BaseModule>
  );
};

export default AccountEdit;
