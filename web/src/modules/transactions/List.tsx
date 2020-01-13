import { DeleteFilled, PlusOutlined, SwapOutlined } from "@ant-design/icons";
import { message, Tag } from "antd";
import { List, SwipeAction } from "antd-mobile";
import { History } from "history";
import React from "react";
import { MutateFunction, useMutation } from "react-query";
import { useHistory } from "react-router";
import Fab from "../../components/button/Fab";
import DateTime from "../../components/data/Date";
import Money from "../../components/data/Money";
import { UseItemsPaginated } from "../../dao/base";
import {
  deleteTransaction,
  Transaction,
  useTransactions
} from "../../dao/transactions";
import BaseList from "../base/BaseList";

const renderTransaction = (
  history: History,
  doDelete: MutateFunction<void, Transaction>,
  tx: Transaction
) => {
  let icon: React.ReactNode = tx.category?.icon ?? tx.account.icon;
  if (tx.is_transfer) {
    icon = <SwapOutlined />;
  }

  const title = tx.is_transfer
    ? "Transfer"
    : tx.payee?.label ?? tx.category?.name;

  return (
    <SwipeAction
      key={tx.pk}
      left={
        [
          {
            text: <DeleteFilled />,
            style: { width: 48, backgroundColor: "#f00", color: "#fff" },
            async onPress() {
              await doDelete(tx);
              message.info(`Deleted Transaction #${tx.pk}`);
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
        onClick={() => {
          history.push(`/transactions/${tx.pk}`);
        }}
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
                <em>{tx.is_initial ? "Initial balance" : "uncategorized"}</em>
              )}{" "}
              {tx.tags.map(t => (
                <Tag key={t.pk} color={t.color}>
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

const TransactionList = () => {
  const history = useHistory();
  const [doDelete] = useMutation(deleteTransaction, {
    refetchQueries: ["items/transactions"]
  });
  // const [edit] = useMutation(putTag);
  // const [create] = useMutation(postTag);
  // const location = useLocation<BaseTableLocationState>();

  return (
    <BaseList
      itemName="Transaction"
      itemNamePlural="Transactions"
      useItems={useTransactions as UseItemsPaginated<Transaction>}
      renderRow={renderTransaction.bind(null, history, doDelete)}
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
