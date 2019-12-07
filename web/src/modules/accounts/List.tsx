import { Table } from "antd";
import React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import Money from "../../components/data/Money";
import { fetchAccounts, IAccount } from "../../dao/accounts";
import BaseList, { getColumnSearchProps } from "../base/BaseList";

const { Column } = Table;

const Accounts: React.FC<RouteComponentProps> = ({ match }) => (
  <BaseList itemName="Accounts" fetchItems={fetchAccounts}>
    <Column
      title="Name"
      dataIndex="name"
      render={(name, account: IAccount) => (
        <Link to={`${match.url}/${account.pk}`}>{account.label}</Link>
      )}
      sorter
      {...getColumnSearchProps()}
    />
    <Column title="Institution" dataIndex="institution" sorter />
    <Column
      title="Balance"
      dataIndex="balance"
      align="right"
      sorter
      filters={[
        { text: "SFr.", value: "currency=CHF" },
        { text: "€", value: "currency=EUR" },
        { text: "US$", value: "currency=USD" }
      ]}
      render={(balance, account: IAccount) => (
        <Money
          value={{ amount: balance, currency: account.balance_currency }}
        />
      )}
    />
    <Column
      dataIndex="pk"
      render={pk => <Link to={`${match.url}/${pk}/edit`}>Edit</Link>}
    />
  </BaseList>
);

export default Accounts;
