import { Tag } from "antd";
import { Location } from "history";
import { FormInstance } from "rc-field-form";
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
import { Payee, usePayees } from "../../dao/payees";
import { Tag as TagModel, useTags } from "../../dao/tags";
import { Transaction } from "../../dao/transactions";
import { BaseTableLocationState, getColumnSort } from "../base/BaseTable";
import { EditableColumnsType } from "../base/EditableTable";

interface GetGetColumnOptions {
  createPayee?: (name: string) => Promise<Payee>;
}

const getGetColumns = ({ createPayee }: GetGetColumnOptions = {}): ((
  location?: Location<BaseTableLocationState>,
  form?: FormInstance
) => EditableColumnsType<Transaction>) => {
  return (location, form) => {
    const quickCreatePayee =
      form && createPayee
        ? async (name: string, cb: (item: Payee) => Promise<void>) => {
            const payee = await createPayee(name);
            await cb(payee);
            form?.setFieldsValue({ set_payee: payee.pk });
          }
        : undefined;
    return [
      {
        title: "Date",
        dataIndex: "datetime",
        defaultSortOrder: "descend",
        editable: true,
        width: 145,
        formField: <DatePicker allowClear={false} />,
        render(date: Date) {
          return <DateTime value={date} />;
        },
        ...getColumnSort("datetime", location?.state)
      },
      {
        title: "Account",
        dataIndex: "account",
        formName: "set_account",
        ellipsis: true,
        editable: true,
        formField: <ModelSelect useItems={useAccounts} />,
        formValue: (key, value) => {
          if (key === "account") {
            return ["set_account", value?.pk];
          }
          return [key, value];
        },
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
        formField: <MoneyInput autoFocus fullWidth />,
        render(amount: string, tx) {
          return (
            <Money value={{ amount: amount, currency: tx.amount_currency }} />
          );
        }
      },
      {
        title: "Payee",
        dataIndex: "payee",
        ellipsis: true,
        editable: true,
        formName: "set_payee",
        formField: (
          <ModelSelect
            allowClear
            useItems={usePayees}
            createItem={quickCreatePayee}
            onItemSelect={payee => {
              if (form && payee.default_category) {
                form.setFieldsValue({
                  set_category: payee.default_category.pk
                });
              }
            }}
          />
        ),
        rules: [],
        formValue: (key, value) => ["set_payee", value?.pk],
        render(payee: ModelWithLabel) {
          if (payee) {
            return (
              <Link to={`/settings/payees/${payee.pk}`}>{payee.label}</Link>
            );
          }
        }
      },
      {
        title: "Category",
        dataIndex: "category",
        editable: true,
        ellipsis: true,
        formName: "set_category",
        formField: <CategorySelect allowClear />,
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
            <Link to={`/settings/categories/${category.pk}`}>
              {category.label}
            </Link>
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
        formField: <ModelSelect mode="multiple" useItems={useTags} />,
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
  };
};

export default getGetColumns;
