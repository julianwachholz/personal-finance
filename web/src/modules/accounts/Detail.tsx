import { Descriptions, Spin, Statistic } from "antd";
import React from "react";
import { useQuery } from "react-query";
import { RouteComponentProps } from "react-router-dom";
import { fetchAccount } from "../../dao/accounts";

const { Item } = Descriptions;

interface IDetailParams {
  pk: string;
}

const Account: React.FC<RouteComponentProps<IDetailParams>> = ({ match }) => {
  const { data: account } = useQuery(
    ["Account", { pk: parseInt(match.params.pk, 10) }],
    fetchAccount
  );

  return account ? (
    <>
      <Descriptions title="Account">
        <Item label="ID">{account.pk}</Item>
        <Item label="Label">{account.label}</Item>
        <Item label="Bank">{account.institution}</Item>
      </Descriptions>
      <Statistic
        title="Balance"
        value={account.balance}
        precision={2}
        suffix={account.balance_currency}
      />
    </>
  ) : (
    <Spin />
  );
};

export default Account;
