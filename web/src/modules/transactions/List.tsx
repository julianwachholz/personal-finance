import { message } from "antd";
import React from "react";
import { useMutation } from "react-query";
import { prefetchCategoryTree } from "../../dao/categories";
import {
  postTransaction,
  putTransaction,
  Transaction,
  useTransactions
} from "../../dao/transactions";
import { useAuth } from "../../utils/AuthProvider";
import BaseList from "../base/BaseList";
import columns from "./columns";

const Transactions = () => {
  const { settings } = useAuth();
  const [create] = useMutation(postTransaction);
  const [update] = useMutation(putTransaction);
  prefetchCategoryTree();

  return (
    <BaseList<Transaction>
      editable
      isEditable={tx => !tx.is_initial}
      onSave={async tx => {
        const isNew = tx.pk === 0;
        if (!tx.set_category) {
          tx.set_category = null;
        }
        if (!tx.set_payee) {
          tx.set_payee = null;
        }
        try {
          const savedTx = isNew
            ? await create(tx)
            : await update(tx, {
                updateQuery: ["item/transactions", { pk: tx.pk }]
              });
          message.success(`Transaction ${isNew ? "created" : "updated"}!`);
          return savedTx;
        } catch (e) {
          message.error(`Transaction ${isNew ? "create" : "update"} failed!`);
          throw e;
        }
      }}
      defaultValues={{
        datetime: new Date(),
        set_account: settings?.default_debit_account
      }}
      itemName="Transaction"
      itemNamePlural="Transactions"
      useItems={useTransactions}
      columns={columns}
    />
  );
};

export default Transactions;
