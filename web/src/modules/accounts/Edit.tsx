import { message, Spin } from "antd";
import React from "react";
import { useMutation, useQuery } from "react-query";
import { RouteComponentProps } from "react-router";
import { fetchAccount, putAccount } from "../../dao/accounts";
import AccountForm from "./Form";

interface IDetailParams {
  pk: string;
}
const AccountEdit: React.FC<RouteComponentProps<IDetailParams>> = ({
  match
}) => {
  const pk = parseInt(match.params.pk, 10);

  const { data, isLoading, error } = useQuery(
    ["Account", { pk }],
    fetchAccount
  );

  const [mutate] = useMutation(putAccount, {
    refetchQueries: ["Accounts", ["Account", { pk }]]
  });

  if (isLoading) {
    return <Spin />;
  }

  return (
    <AccountForm
      data={data}
      onSave={async data => {
        try {
          await mutate({ pk, ...data });
          message.success("Account updated!");
        } catch (e) {
          message.error("Account update failed!");
        }
      }}
    />
  );
};

export default AccountEdit;
