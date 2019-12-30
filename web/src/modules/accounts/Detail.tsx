import { Button, Descriptions, Spin, Statistic } from "antd";
import React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { useAccount } from "../../dao/accounts";
import BaseModule from "../base/BaseModule";
import RelatedTransactions from "../transactions/RelatedTransactions";

const { Item } = Descriptions;

interface DetailParams {
  pk: string;
}

const Account = ({ match }: RouteComponentProps<DetailParams>) => {
  const { data: account, isLoading, error } = useAccount(match.params.pk);

  return account ? (
    <BaseModule
      title={account.label}
      extra={[
        <Link key="edit" to={`${match.url}/edit`}>
          <Button type="primary">Edit Account</Button>
        </Link>,
        <Link key="delete" to={`${match.url}/delete`}>
          <Button type="danger">Delete Account</Button>
        </Link>
      ]}
    >
      <Descriptions title="Account">
        <Item label="Name">{account.name}</Item>
        <Item label="Icon">{account.icon}</Item>
        <Item label="Institution">{account.institution}</Item>
      </Descriptions>
      <Statistic
        title="Balance"
        value={account.balance}
        precision={2}
        suffix={account.balance_currency}
      />
      <RelatedTransactions
        filters={[`account=${account.pk}`]}
        excludeColumns={["account"]}
      />
    </BaseModule>
  ) : (
    <Spin spinning={isLoading}>{error?.toString()}</Spin>
  );
};

export default Account;
