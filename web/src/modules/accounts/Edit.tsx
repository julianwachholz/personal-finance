import { Spin } from "antd";
import React from "react";
import { useQuery } from "react-query";
import { RouteComponentProps } from "react-router";
import { fetchAccount } from "../../dao/accounts";
import AccountForm from "./Form";

interface IDetailParams {
  pk: string;
}
const AccountEdit: React.FC<RouteComponentProps<IDetailParams>> = ({
  match
}) => {
  const { data, isLoading, error } = useQuery(
    ["Account", { pk: parseInt(match.params.pk, 10) }],
    fetchAccount
  );

  if (isLoading) {
    return <Spin />;
  }

  return <AccountForm initial={data} />;
};

export default AccountEdit;
