import { ColumnsType } from "antd/lib/table/Table";
import { format } from "date-fns";
import React from "react";
import { Link } from "react-router-dom";
import Money from "../../components/data/Money";
import { RelatedModel } from "../../dao/base";
import { Transaction } from "../../dao/transactions";

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
      return <Money value={{ amount: amount, currency: tx.amount_currency }} />;
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
        <Link to={`/settings/categories/${category.pk}`}>{category.label}</Link>
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

export default columns;
