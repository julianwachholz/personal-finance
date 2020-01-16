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
import { RelatedModel } from "../../dao/base";
import { Payee, usePayees } from "../../dao/payees";
import { Tag as TagModel, useTags } from "../../dao/tags";
import { Transaction } from "../../dao/transactions";
import { BaseTableLocationState, getColumnSort } from "../base/BaseTable";
import { EditableColumnsType } from "../base/EditableTable";

interface GetGetColumnOptions {
  createPayee?: (name: string) => Promise<Payee>;
  createTag?: (name: string) => Promise<TagModel>;
}

const getGetColumns = ({ createPayee, createTag }: GetGetColumnOptions = {}): ((
  location?: Location<BaseTableLocationState>,
  form?: FormInstance
) => EditableColumnsType<Transaction>) => {
  return (location, form) => {
    const quickCreatePayee =
      form && createPayee
        ? async (name: string) => {
            form?.setFieldsValue({
              payee: { value: "0", label: `Creating "${name}"...` }
            });
            const payee = await createPayee(name);
            form?.setFieldsValue({
              payee: { value: payee.pk, label: payee.label }
            });
          }
        : undefined;

    const quickCreateTag =
      form && createTag
        ? async (name: string) => {
            const tags = form
              .getFieldValue("tags")
              .filter((tag: any) => tag.value !== "0");

            const loadingTags = [
              ...tags,
              { value: "0", label: `Creating ${name}...` }
            ];

            form?.setFieldsValue({ tags: loadingTags });
            const tag = await createTag(name);
            tags.push({ value: tag.pk, label: tag.label });
            form?.setFieldsValue({ tags });
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
        ellipsis: true,
        editable: true,
        formField: <ModelSelect useItems={useAccounts} />,
        render(account: RelatedModel) {
          if (account) {
            return (
              <Link to={`/accounts/${account.value}`}>{account.label}</Link>
            );
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
        formField: (
          <ModelSelect
            allowClear
            useItems={usePayees}
            createItem={quickCreatePayee}
            onItemSelect={payee => {
              if (form && payee.default_category) {
                form.setFieldsValue({
                  category: payee.default_category
                });
              }
            }}
          />
        ),
        rules: [],
        render(payee: RelatedModel) {
          if (payee) {
            return (
              <Link to={`/settings/payees/${payee.value}`}>{payee.label}</Link>
            );
          }
        }
      },
      {
        title: "Category",
        dataIndex: "category",
        editable: true,
        ellipsis: true,
        formField: <CategorySelect allowClear />,
        rules: [],
        render(category: RelatedModel, tx) {
          if (tx.is_transfer) {
            return <em>Transfer</em>;
          }
          if (tx.is_initial) {
            return <em>Initial balance</em>;
          }
          return category ? (
            <Link to={`/settings/categories/${category.value}`}>
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
        formField: (
          <ModelSelect
            mode="multiple"
            useItems={useTags}
            createItem={quickCreateTag}
          />
        ),
        rules: [],
        render(tags: (RelatedModel & { color: string })[]) {
          return tags ? (
            <>
              {tags.map((tag, i) => (
                <Link key={i} to={`/settings/tags/${tag.value}`}>
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
