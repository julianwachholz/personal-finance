import { Button } from "antd";
import React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { fetchTransactions, Transaction } from "../../dao/transactions";
import BaseList from "../base/BaseList";
import columns from "./columns";

const Transactions = ({ match }: RouteComponentProps) => {
  return (
    <BaseList<Transaction>
      itemName="Transaction"
      itemNamePlural="Transactions"
      fetchItems={fetchTransactions}
      columns={columns}
      actions={[
        <Button key="create" type="primary">
          <Link to={`${match.url}/create`}>Create Transaction</Link>
        </Button>
      ]}
    />
  );
};

export default Transactions;
