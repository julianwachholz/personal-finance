import { ImportOutlined, SwapOutlined } from "@ant-design/icons";
import { Button, Menu, message } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { RouteComponentProps } from "react-router";
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

const TransactionsTable = (props: RouteComponentProps) => {
  const [t] = useTranslation("transactions");
  const { settings } = useAuth();
  const [transferVisible, setTransferVisible] = useState(false);
  const [importVisible, setImportVisible] = useState(false);

  const [create] = useMutation(postTransaction);
  const [update] = useMutation(putTransaction);
  prefetchCategoryTree();

  const [bulkDelete] = useMutation(bulkDeleteTransactions, {
    refetchQueries: ["items/transactions"]
  });

  const [createPayee] = useMutation(postPayee);
  const [createTag] = useMutation(postTag);

  const getColumns = getGetColumns(t, {
    async createPayee(name) {
      return await createPayee({ name } as Payee);
    },
    async createTag(name) {
      return await createTag({ name } as Tag);
    }
  });

  return (
    <BaseEditableTable<Transaction>
      itemName={t("transactions:transaction", "Transaction")}
      itemNamePlural={t("transactions:transaction_plural", "Transactions")}
      useItems={useTransactions}
      getColumns={getColumns}
      editable
      canEdit={canEdit}
      inlineCreateButtons={[
        {
          key: "create-income",
          label: t("transactions:add_income", "Add Income"),
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
          label: t("transactions:add_expense", "Add Expense"),
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
          if (isNew) {
            message.success(t("transactions:created", "Transaction created"));
          } else {
            message.success(t("transactions:updated", "Transaction updated"));
          }
          return savedTx;
        } catch (e) {
          if (isNew) {
            message.error(
              t("transactions:create_error", "Transaction create failed")
            );
          } else {
            message.error(
              t("transactions:update_error", "Transaction update failed")
            );
          }
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
          {t("transactions:transfer_button", "Transfer")}
        </Button>
      ]}
      extraActions={[
        <Menu.Item
          key="import"
          onClick={() => {
            // setImportVisible(true);
          }}
        >
          <ImportOutlined /> {t("transactions:import", "Import Transactions")}
        </Menu.Item>
      ]}
      bulkActions={[
        {
          key: "delete",
          name: t("transactions:bulk.delete", "Delete transactions"),
          async action(pks) {
            const { deleted } = await bulkDelete({ pks });
            message.info(
              t(
                "transactions:bulk.deleted",
                "Deleted {{ count }} transactions",
                { count: deleted }
              )
            );
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
