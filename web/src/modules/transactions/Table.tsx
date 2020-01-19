import { ImportOutlined, SwapOutlined } from "@ant-design/icons";
import { Button, Menu, message } from "antd";
import React, { useState } from "react";
import { useMutation } from "react-query";
import { prefetchCategoryTree } from "../../dao/categories";
import { Payee, postPayee } from "../../dao/payees";
import { postTag, Tag } from "../../dao/tags";
import {
  bulkDeleteTransactions,
  canEdit,
  postTransaction,
  putTransaction,
  Transaction,
  useTransactions
} from "../../dao/transactions";
import { useAuth } from "../../utils/AuthProvider";
import { default as BaseEditableTable } from "../base/BaseEditableTable";
import getGetColumns from "./columns";
import ImportWizard from "./ImportWizard";
import { TransferModal } from "./TransferForm";

const TransactionsTable = () => {
  const { settings } = useAuth();
  const [transferVisible, setTransferVisible] = useState(false);
  const [importVisible, setImportVisible] = useState(!false);

  const [create] = useMutation(postTransaction);
  const [update] = useMutation(putTransaction);
  prefetchCategoryTree();

  const [bulkDelete] = useMutation(bulkDeleteTransactions, {
    refetchQueries: ["items/transactions"]
  });

  const [createPayee] = useMutation(postPayee);
  const [createTag] = useMutation(postTag);

  const getColumns = getGetColumns({
    async createPayee(name) {
      return await createPayee({ name } as Payee);
    },
    async createTag(name) {
      return await createTag({ name } as Tag);
    }
  });

  return (
    <BaseEditableTable<Transaction>
      itemName="Transaction"
      itemNamePlural="Transactions"
      useItems={useTransactions}
      getColumns={getColumns}
      editable
      canEdit={canEdit}
      inlineCreateButtons={[
        {
          key: "create-income",
          label: "Add Income",
          buttonProps: {
            type: "primary"
          },
          defaultValues: {
            type: "income",
            account: settings?.default_credit_account,
            category: settings?.default_credit_category
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
            account: settings?.default_debit_account
          }
        }
      ]}
      onSave={async tx => {
        const isNew = tx.pk === 0;
        if (isNew && tx.type === "expense" && tx.amount[0] !== "-") {
          tx.amount = `-${tx.amount}`;
        }
        if (!tx.category) {
          tx.category = null;
        }
        if (!tx.payee) {
          tx.payee = null;
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
            setTransferVisible(true);
          }}
        >
          Transfer
        </Button>
      ]}
      extraActions={[
        <Menu.Item
          key="import"
          onClick={() => {
            setImportVisible(true);
          }}
        >
          <ImportOutlined /> Import Transactions
        </Menu.Item>
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
      <TransferModal visible={transferVisible} onVisible={setTransferVisible} />
      <ImportWizard visible={importVisible} onVisible={setImportVisible} />
    </BaseEditableTable>
  );
};

export default TransactionsTable;
