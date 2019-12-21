import { Button } from "antd";
import { ColumnsType } from "antd/lib/table/Table";
import { format } from "date-fns";
import React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import Money from "../../components/data/Money";
import { Account } from "../../dao/accounts";
import { Category } from "../../dao/categories";
import { Tag } from "../../dao/tags";
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
      render(amount, tx) {
        return (
          <Money value={{ amount: amount, currency: tx.amount_currency }} />
        );
      }
    },
    {
      title: "Description",
      dataIndex: "text"
    },
    {
      title: "Category",
      dataIndex: "category",
      render(category: Category) {
        return (
          <Link to={`/settings/categories/${category.pk}`}>
            {category.label}
          </Link>
        );
      }
    },
    {
      title: "Account",
      dataIndex: "account",
      render(account: Account) {
        return <Link to={`/accounts/${account.pk}`}>{account.label}</Link>;
      }
    },
    {
      title: "Tags",
      dataIndex: "tags",
      render(tags: Tag[]) {
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
      tableProps={{ size: "small" }}
      actions={[
        <Button key="create" type="primary">
          <Link to={`${match.url}/create`}>Create Transaction</Link>
        </Button>
      ]}
    />
  );
};

export default Transactions;
