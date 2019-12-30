import { Button } from "antd";
import { ColumnsType } from "antd/lib/table/Table";
import { format } from "date-fns";
import React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import Money from "../../components/data/Money";
import { RelatedModel } from "../../dao/base";
import { fetchTransactions, Transaction } from "../../dao/transactions";
import BaseList from "../base/BaseList";

const Transactions = ({ match }: RouteComponentProps) => {
  const columns: ColumnsType<Transaction> = [
    {
      title: "Date",
      dataIndex: "datetime",
      sorter: true,
      defaultSortOrder: "descend",
      render(date: Date) {
        return format(date, "d MMM");
      }
    },
    {
      title: "Amount",
      dataIndex: "amount",
      align: "right",
      render(amount: string, tx) {
        return (
          <Money value={{ amount: amount, currency: tx.amount_currency }} />
        );
      }
    },
    {
      title: "Category",
      dataIndex: "category",
      render(category: RelatedModel, tx) {
        if (tx.is_transfer) {
          return <em>Transfer</em>;
        }
        return category ? (
          <Link to={`/settings/categories/${category.pk}`}>
            {category.label}
          </Link>
        ) : (
          <em>uncategorized</em>
        );
      }
    },
    {
      title: "Account",
      dataIndex: "account",
      render(account: RelatedModel) {
        return <Link to={`/accounts/${account.pk}`}>{account.label}</Link>;
      }
    },
    {
      title: "Payee",
      dataIndex: "payee",
      render(payee: RelatedModel) {
        if (payee)
          return <Link to={`/settings/payees/${payee.pk}`}>{payee.label}</Link>;
      }
    },
    {
      title: "Description",
      dataIndex: "text"
    },
    {
      title: "Tags",
      dataIndex: "tags",
      render(tags: RelatedModel[]) {
        return (
          <>
            {tags.map((tag, i) => (
              <Link key={i} to={`/settings/tags/${tag.pk}`}>
                {tag.label}
              </Link>
            ))}
          </>
        );
      }
    }
  ];

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
