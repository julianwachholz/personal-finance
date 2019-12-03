import { Table } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import Money from "../../components/data/Money";
import { fetchAccounts } from "../../dao/accounts";
import ItemTable from "../base/ItemTable";

const { Column } = Table;

const Accounts: React.FC = () => (
  <ItemTable itemName="Accounts" fetchItems={fetchAccounts}>
    <Column
      title="Name"
      dataIndex="name"
      render={(name, account: any) => account.label}
      sorter
    />
    <Column title="Institution" dataIndex="institution" sorter />
    <Column
      title="Balance"
      dataIndex="balance"
      align="right"
      sorter
      render={(balance, account: any) => (
        <Money amount={balance} currency={account.balance_currency} />
      )}
    />
    <Column
      render={(_, account: any) => (
        <Link to={`/accounts/${account.pk}`}>Edit</Link>
      )}
    />
  </ItemTable>
);

export default Accounts;
