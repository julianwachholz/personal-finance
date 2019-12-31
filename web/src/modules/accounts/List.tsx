import { Button } from "antd";
import { ColumnsType } from "antd/lib/table/Table";
import React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import Money from "../../components/data/Money";
import { Account, useAccounts } from "../../dao/accounts";
import BaseList from "../base/BaseList";

const Accounts = ({ match }: RouteComponentProps) => {
  const columns: ColumnsType<Account> = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: true,
      render(_, account) {
        return <Link to={`${match.url}/${account.pk}`}>{account.label}</Link>;
      }
    },
    {
      title: "Institution",
      dataIndex: "institution",
      sorter: true
    },
    {
      title: "Balance",
      dataIndex: "balance",
      align: "right",
      sorter: true,
      filters: [
        { text: "SFr.", value: "currency=CHF" },
        { text: "€", value: "currency=EUR" },
        { text: "US$", value: "currency=USD" }
      ],
      render(balance, account) {
        return (
          <Money value={{ amount: balance, currency: account.currency }} />
        );
      }
    },
    {
      align: "right",
      render(_, account) {
        return <Link to={`${match.url}/${account.pk}/edit`}>Edit</Link>;
      }
    }
  ];

  return (
    <BaseList<Account>
      itemName="Account"
      itemNamePlural="Accounts"
      useItems={useAccounts}
      columns={columns}
      actions={[
        <Link key="create" to={`${match.url}/create`}>
          <Button type="primary">Create Account</Button>
        </Link>
      ]}
    />
  );
};

export default Accounts;
