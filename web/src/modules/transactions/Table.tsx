import { SwapOutlined } from "@ant-design/icons";
import { Button, message, Modal } from "antd";
import React, { useState } from "react";
import { setQueryData, useMutation } from "react-query";
import { prefetchCategoryTree } from "../../dao/categories";
import { Payee, postPayee } from "../../dao/payees";
import {
  bulkDeleteTransactions,
  postTransaction,
  putTransaction,
  Transaction,
  useTransactions
} from "../../dao/transactions";
import { useAuth } from "../../utils/AuthProvider";
import { default as BaseEditableTable } from "../base/BaseEditableTable";
import getGetColumns from "./columns";
import TransferForm from "./TransferForm";

const TransactionsTable = () => {
  const { settings } = useAuth();
  const [transferModalVisible, setTransferModalVisible] = useState(false);

  const [create] = useMutation(postTransaction);
  const [update] = useMutation(putTransaction);
  prefetchCategoryTree();

  const [bulkDelete] = useMutation(bulkDeleteTransactions, {
    refetchQueries: ["items/transactions"]
  });

  const [createPayee] = useMutation(postPayee);

  const getColumns = getGetColumns({
    async createPayee(name) {
      const data = { name } as Payee;
      const payee = await createPayee(data);
      setQueryData([`item/payees`, { pk: payee.pk }], payee);
      return payee;
    }
  });

  return (
    <BaseEditableTable<Transaction>
      itemName="Transaction"
      itemNamePlural="Transactions"
      useItems={useTransactions}
      getColumns={getColumns}
      editable
      isEditable={tx => !tx.is_initial}
      inlineCreateButtons={[
        {
          key: "create-income",
          label: "Add Income",
          buttonProps: {
            type: "primary"
          },
          defaultValues: {
            type: "income",
            set_account: settings?.default_credit_account,
            set_category: settings?.default_credit_category
          }
        },
        {
          key: "create-expense",
          label: "Add Expense",
          buttonProps: {
            type: "primary"
          },
          defaultValues: {
            type: "expense",
            set_account: settings?.default_debit_account
          }
        }
      ]}
      onSave={async tx => {
        const isNew = tx.pk === 0;
        if (isNew && tx.type === "expense" && tx.amount[0] !== "-") {
          tx.amount = `-${tx.amount}`;
        }
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
          message.success(`Transaction ${isNew ? "created" : "updated"}`);
          return savedTx;
        } catch (e) {
          message.error(`Transaction ${isNew ? "create" : "update"} failed`);
          throw e;
        }
      }}
      defaultValues={{
        datetime: () => new Date()
      }}
      actions={[
        <Button
          key="transfer"
          icon={<SwapOutlined />}
          onClick={() => {
            setTransferModalVisible(true);
          }}
        >
          Transfer
        </Button>
      ]}
      bulkActions={[
        {
          key: "delete",
          name: "Delete transactions",
          async action(pks) {
            const { deleted } = await bulkDelete({ pks });
            message.info(`Deleted ${deleted} transactions`);
          }
        }
      ]}
    >
      <Modal
        visible={transferModalVisible}
        title="Balance Transfer"
        maskClosable
        onCancel={() => setTransferModalVisible(false)}
        footer={false}
      >
        <TransferForm />
      </Modal>
    </BaseEditableTable>
  );
};

export default TransactionsTable;
