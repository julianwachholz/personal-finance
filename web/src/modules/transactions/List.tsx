import { DeleteFilled, PlusOutlined, SwapOutlined } from "@ant-design/icons";
import { Tag } from "antd";
import { List, SwipeAction } from "antd-mobile";
import { History } from "history";
import { TFunction } from "i18next";
import React from "react";
import { useTranslation } from "react-i18next";
import { MutateFunction, useMutation } from "react-query";
import { RouteComponentProps } from "react-router";
import Fab from "../../components/button/Fab";
import DateTime from "../../components/data/Date";
import Money from "../../components/data/Money";
import { UseItemsPaginated } from "../../dao/base";
import {
  canEdit,
  deleteTransaction,
  Transaction,
  useTransactions
} from "../../dao/transactions";
import { COLOR_DANGER } from "../../utils/constants";
import BaseList from "../base/BaseList";
import { confirmDeleteTransaction } from "./delete";

export const renderTransaction = (
  history: History,
  doDelete: MutateFunction<void, Transaction> | false,
  t: TFunction,
  tx: Transaction
) => {
  let icon: React.ReactNode = tx.category?.icon ?? tx.account.icon;
  if (tx.is_transfer) {
    icon = <SwapOutlined />;
  }

  const title = tx.is_transfer
    ? t("transactions:transfer_label", "Transfer")
    : tx.payee?.label ?? tx.category?.name;

  return (
    <SwipeAction
      key={tx.pk}
      disabled={doDelete === false || !canEdit(tx)}
      left={
        [
          {
            text: <DeleteFilled />,
            style: { width: 48, backgroundColor: COLOR_DANGER, color: "#fff" },
            onPress() {
              if (doDelete) {
                confirmDeleteTransaction(tx, doDelete, t);
              }
            }
          }
        ] as any
      }
    >
      <List.Item
        thumb={<>{icon}</>}
        extra={
          <Money value={{ amount: tx.amount, currency: tx.amount_currency }} />
        }
        onClick={
          canEdit(tx)
            ? () => {
                history.push(`/transactions/${tx.pk}`);
              }
            : undefined
        }
      >
        <DateTime value={tx.datetime} />
        {title ? " - " : ""}
        {title}
        <List.Item.Brief>
          {tx.is_transfer ? (
            tx.account.label
          ) : (
            <>
              {tx.text || tx.category?.name || (
                <em>
                  {tx.is_initial
                    ? t("transactions:initial_balance", "Initial balance")
                    : t("transactions:uncategorized", "uncategorized")}
                </em>
              )}{" "}
              {tx.tags.map(t => (
                <Tag key={t.value} color={t.color}>
                  {t.label}
                </Tag>
              ))}
            </>
          )}
        </List.Item.Brief>
      </List.Item>
    </SwipeAction>
  );
};

const TransactionList = ({ history }: RouteComponentProps) => {
  const [t] = useTranslation("transactions");
  const [doDelete] = useMutation(deleteTransaction, {
    refetchQueries: ["items/transactions"]
  });

  return (
    <BaseList
      itemName="Transaction"
      itemNamePlural="Transactions"
      useItems={useTransactions as UseItemsPaginated<Transaction>}
      renderRow={renderTransaction.bind(null, history, doDelete, t)}
      fab={
        <Fab
          icon={<PlusOutlined />}
          onClick={() => {
            history.push(`/transactions/create`);
          }}
        />
      }
    />
  );
};

export default TransactionList;
