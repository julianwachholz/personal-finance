import { Tag } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import DateTime from "../../components/data/Date";
import Money from "../../components/data/Money";
import CategorySelect from "../../components/form/CategorySelect";
import DatePicker from "../../components/form/DatePicker";
import ModelSelect from "../../components/form/ModelSelect";
import MoneyInput from "../../components/form/MoneyInput";
import { useAccounts } from "../../dao/accounts";
import { ModelWithLabel } from "../../dao/base";
import { usePayees } from "../../dao/payees";
import { Tag as TagModel, useTags } from "../../dao/tags";
import { Transaction } from "../../dao/transactions";
import { EditableColumnsType } from "../base/BaseList";

const columns: EditableColumnsType<Transaction> = [
  {
    title: "Date",
    dataIndex: "datetime",
    sorter: true,
    defaultSortOrder: "descend",
    editable: true,
    width: 145,
    formField: <DatePicker allowClear={false} />,
    render(date: Date) {
      return <DateTime value={date} />;
    }
  },
  {
    title: "Account",
    dataIndex: "account",
    formName: "set_account",
    ellipsis: true,
    editable: true,
    formField: <ModelSelect useItems={useAccounts} />,
    formValue: (key, value) => ["set_account", value?.pk],
    render(account: ModelWithLabel) {
      if (account) {
        return <Link to={`/accounts/${account.pk}`}>{account.label}</Link>;
      }
    }
  },
  {
    title: "Amount",
    dataIndex: "amount",
    align: "right",
    editable: true,
    formField: <MoneyInput autoFocus />,
    render(amount: string, tx) {
      return <Money value={{ amount: amount, currency: tx.amount_currency }} />;
    }
  },
  {
    title: "Payee",
    dataIndex: "payee",
    ellipsis: true,
    editable: true,
    formName: "set_payee",
    formField: <ModelSelect useItems={usePayees} />,
    rules: [],
    formValue: (key, value) => ["set_payee", value?.pk],
    formChange: (changed, form) => {
      // @TODO set category directly
      // const p = form.getFieldValue("payee");
      // const p2 = form.getFieldValue("set_payee");
      // console.log("payee was changed!", p, p2, changed);
    },
    render(payee: ModelWithLabel) {
      if (payee) {
        return <Link to={`/settings/payees/${payee.pk}`}>{payee.label}</Link>;
      }
    }
  },
  {
    title: "Category",
    dataIndex: "category",
    editable: true,
    formName: "set_category",
    formField: <CategorySelect />,
    formValue: (key, value) => ["set_category", value?.pk],
    rules: [],
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
    title: "Description",
    dataIndex: "text",
    ellipsis: true,
    editable: true,
    rules: []
  },
  {
    title: "Tags",
    dataIndex: "tags",
    editable: true,
    ellipsis: true,
    formName: "set_tags",
    formValue: (key, value) => [
      "set_tags",
      value.map((v: ModelWithLabel) => v?.pk)
    ],
    formField: <ModelSelect mode="tags" useItems={useTags} />,
    rules: [],
    render(tags: TagModel[]) {
      return tags ? (
        <>
          {tags.map((tag, i) => (
            <Link key={i} to={`/settings/tags/${tag.pk}`}>
              <Tag color={tag.color}>{tag.label}</Tag>
            </Link>
          ))}
        </>
      ) : null;
    }
  }
];

export default columns;
