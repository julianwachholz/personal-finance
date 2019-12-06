import { message, Spin } from "antd";
import React from "react";
import { useMutation } from "react-query";
import { RouteComponentProps } from "react-router";
import { putAccount, useAccount } from "../../dao/accounts";
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

  if (!data || isLoading) {
    return <Spin />;
  }

  return (
    <AccountForm
      data={data}
      onSave={async data => {
        try {
          await mutate({ pk, ...data }, { updateQuery: ["Account", { pk }] });
          message.success("Account updated!");
        } catch (e) {
          message.error("Account update failed!");
        }
      }}
    />
  );
};

export default AccountEdit;
