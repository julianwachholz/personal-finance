import { Table } from "antd";
import React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import Money from "../../components/data/Money";
import { fetchAccounts, IAccount } from "../../dao/accounts";
import ItemTable from "../base/ItemTable";

const { Column } = Table;

const Accounts: React.FC<RouteComponentProps> = ({ match }) => (
  <ItemTable itemName="Accounts" fetchItems={fetchAccounts}>
    <Column
      title="Name"
      dataIndex="name"
      render={(name, account: IAccount) => (
        <Link to={`${match.path}/${account.pk}`}>{account.label}</Link>
      )}
      sorter
    />
    <Column title="Institution" dataIndex="institution" sorter />
    <Column
      title="Balance"
      dataIndex="balance"
      align="right"
      sorter
      render={(balance, account: IAccount) => (
        <Money amount={balance} currency={account.balance_currency} />
      )}
    />
    <Column
      dataIndex="pk"
      render={pk => <Link to={`${match.path}/${pk}/edit`}>Edit</Link>}
    />
  </ItemTable>
);

export default Accounts;
