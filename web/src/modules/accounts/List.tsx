import { Button } from "antd";
import { ColumnsType } from "antd/lib/table/Table";
import React from "react";
import { useMutation } from "react-query";
import { Link, RouteComponentProps, useLocation } from "react-router-dom";
import Money from "../../components/data/Money";
import { Account, moveAccount, useAccounts } from "../../dao/accounts";
import BaseList, {
  BaseListLocationState,
  getColumnSort
} from "../base/BaseList";

const Accounts = ({ match }: RouteComponentProps) => {
  const [move] = useMutation(moveAccount, {
    refetchQueries: ["items/accounts"]
  });

  const location = useLocation<BaseListLocationState>();
  const columns: ColumnsType<Account> = [
    {
      title: "Name",
      dataIndex: "name",
      render(_, account) {
        return <Link to={`${match.url}/${account.pk}`}>{account.label}</Link>;
      },
      ...getColumnSort("name", location.state)
    },
    {
      title: "Institution",
      dataIndex: "institution",
      ...getColumnSort("institution", location.state)
    },
    {
      title: "Balance",
      dataIndex: "balance",
      align: "right",
      filters: [
        { text: "SFr.", value: "currency=CHF" },
        { text: "€", value: "currency=EUR" },
        { text: "US$", value: "currency=USD" }
      ],
      render(balance, account) {
        return (
          <Money value={{ amount: balance, currency: account.currency }} />
        );
      },
      ...getColumnSort("balance", location.state)
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
      isSortable
      onMove={(pk, pos) => {
        move({ pk, pos });
      }}
      actions={[
        <Link key="create" to={`${match.url}/create`}>
          <Button type="primary">Create Account</Button>
        </Link>
      ]}
    />
  );
};

export default Accounts;
