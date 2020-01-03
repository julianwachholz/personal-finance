import { Button, message } from "antd";
import React from "react";
import { useMutation } from "react-query";
import { Link, RouteComponentProps } from "react-router-dom";
import { prefetchCategoryTree } from "../../dao/categories";
import {
  postTransaction,
  putTransaction,
  Transaction,
  useTransactions
} from "../../dao/transactions";
import BaseList from "../base/BaseList";
import columns from "./columns";

const Transactions = ({ match }: RouteComponentProps) => {
  const [create] = useMutation(postTransaction);
  const [update] = useMutation(putTransaction);

  prefetchCategoryTree();

  return (
    <BaseList<Transaction>
      editable
      isEditable={tx => !tx.is_initial}
      onSave={async tx => {
        const isNew = tx.pk === 0;
        try {
          const savedTx = isNew
            ? await create(tx)
            : await update(tx, {
                updateQuery: ["item/transactions", { pk: tx.pk }]
              });
          message.success(`Transaction ${isNew ? "created" : "updated"}!`);
          return savedTx;
        } catch (e) {
          message.error("Transaction failed!");
          throw e;
        }
      }}
      defaultValues={{ datetime: new Date() }}
      itemName="Transaction"
      itemNamePlural="Transactions"
      useItems={useTransactions}
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
