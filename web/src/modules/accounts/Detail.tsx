import { Button, Descriptions, Spin, Statistic } from "antd";
import React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { useAccount } from "../../dao/accounts";
import BaseModule from "../base/BaseModule";

const { Item } = Descriptions;

interface IDetailParams {
  pk: string;
}

const Account: React.FC<RouteComponentProps<IDetailParams>> = ({ match }) => {
  const { data: account } = useAccount(match.params.pk);

  return account ? (
    <BaseModule title={account.label}>
      <Descriptions title="Account">
        <Item label="ID">{account.pk}</Item>
        <Item label="Name">{account.name}</Item>
        <Item label="Bank">{account.institution}</Item>
      </Descriptions>
      <Statistic
        title="Balance"
        value={account.balance}
        precision={2}
        suffix={account.balance_currency}
      />
      <Link to={`${match.url}/edit`}>
        <Button type="primary">Edit Account</Button>
      </Link>
    </BaseModule>
  ) : (
    <Spin />
  );
};

export default Account;
