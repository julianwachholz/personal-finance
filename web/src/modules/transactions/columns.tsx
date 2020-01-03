import { InputNumber } from "antd";
import { format } from "date-fns";
import React from "react";
import { Link } from "react-router-dom";
import Money from "../../components/data/Money";
import DatePicker from "../../components/form/DatePicker";
import { ModelWithLabel } from "../../dao/base";
import { Transaction } from "../../dao/transactions";
import { EditableColumnsType } from "../base/BaseList";

const columns: EditableColumnsType<Transaction> = [
  {
    title: "Date",
    dataIndex: "datetime",
    sorter: true,
    defaultSortOrder: "descend",
    editable: true,
    width: 130,
    formField: <DatePicker allowClear={false} />,
    render(date: Date) {
      if (!date) {
        return;
      }
      const str = format(date, "Pp");
      return (
        <time dateTime={str} title={str}>
          {format(date, "d MMM")}
        </time>
      );
    }
  },
  {
    title: "Amount",
    dataIndex: "amount",
    align: "right",
    editable: true,
    formField: <InputNumber precision={2} />,
    render(amount: string, tx) {
      return <Money value={{ amount: amount, currency: tx.amount_currency }} />;
    }
  },
  {
    title: "Category",
    dataIndex: "category",
    editable: true,
    render(category: ModelWithLabel, tx) {
      if (tx.is_transfer) {
        return <em>Transfer</em>;
      }
      if (tx.is_initial) {
        return <em>Initial balance</em>;
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
    editable: true,
    render(account: ModelWithLabel) {
      if (!account) {
        return "no";
      }
      return <Link to={`/accounts/${account.pk}`}>{account.label}</Link>;
    }
  },
  {
    title: "Payee",
    dataIndex: "payee",
    ellipsis: true,
    editable: true,
    render(payee: ModelWithLabel) {
      if (payee)
        return <Link to={`/settings/payees/${payee.pk}`}>{payee.label}</Link>;
    }
  },
  {
    title: "Description",
    dataIndex: "text",
    ellipsis: true,
    editable: true
  },
  {
    title: "Tags",
    dataIndex: "tags",
    editable: true,
    render(tags: ModelWithLabel[]) {
      if (!tags) {
        return "no";
      }
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
