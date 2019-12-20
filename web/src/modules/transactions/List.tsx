import { Button } from "antd";
import { ColumnsType } from "antd/lib/table/Table";
import React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { IAccount } from "../../dao/accounts";
import { ICategory } from "../../dao/categories";
import { ITag } from "../../dao/tags";
import { fetchTransactions, ITransaction } from "../../dao/transactions";
import BaseList from "../base/BaseList";

const Transactions: React.FC<RouteComponentProps> = ({ match }) => {
  const columns: ColumnsType<ITransaction> = [
    {
      title: "Date",
      dataIndex: "datetime"
    },
    {
      title: "Amount",
      dataIndex: "amount"
    },
    {
      title: "Description",
      dataIndex: "text"
    },
    {
      title: "Category",
      dataIndex: "category",
      render(category: ICategory) {
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
      render(account: IAccount) {
        return <Link to={`/accounts/${account.pk}`}>{account.label}</Link>;
      }
    },
    {
      title: "Tags",
      dataIndex: "tags",
      render(tags: ITag[]) {
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
    <BaseList
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
