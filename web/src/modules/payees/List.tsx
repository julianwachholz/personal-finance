import { Button, Input, message, Popconfirm, Select } from "antd";
import React from "react";
import { useMutation } from "react-query";
import { Link, RouteComponentProps, useLocation } from "react-router-dom";
import CategorySelect from "../../components/form/CategorySelect";
import { ModelWithLabel } from "../../dao/base";
import {
  bulkDeletePayees,
  deletePayee,
  Payee,
  postPayee,
  putPayee,
  usePayees
} from "../../dao/payees";
import { useSettings } from "../../utils/SettingsProvider";
import BaseEditableTable from "../base/BaseEditableTable";
import {
  BaseTableLocationState,
  getColumnFilter,
  getColumnSort
} from "../base/BaseTable";
import { EditableColumnsType } from "../base/EditableTable";

const Payees = ({ match }: RouteComponentProps) => {
  const { tableSize } = useSettings();
  const [doDelete] = useMutation(deletePayee, {
    refetchQueries: ["items/payees"]
  });
  const [edit] = useMutation(putPayee);
  const [create] = useMutation(postPayee);
  const [bulkDelete] = useMutation(bulkDeletePayees, {
    refetchQueries: ["items/payees"]
  });

  const location = useLocation<BaseTableLocationState>();

  const columns: EditableColumnsType<Payee> = [
    {
      title: "Name",
      dataIndex: "name",
      editable: true,
      formField: <Input autoFocus size={tableSize} />,
      render(name, tag) {
        return <Link to={`${match.url}/${tag.pk}`}>{name}</Link>;
      },
      ...getColumnSort("name", location.state)
    },
    {
      title: "Type",
      dataIndex: "type",
      render(type) {
        return type === "business" ? "Business" : "Private";
      },
      editable: true,
      formField: (
        <Select size={tableSize}>
          <Select.Option value="business">Business</Select.Option>
          <Select.Option value="private">Private</Select.Option>
        </Select>
      ),
      filterMultiple: false,
      filters: [
        { text: "Business", value: "business" },
        { text: "Private", value: "private" }
      ],
      ...getColumnFilter("type", location.state)
    },
    {
      title: "Default Category",
      dataIndex: "default_category",
      render(category: ModelWithLabel) {
        return category ? (
          <Link to={`/settings/categories/${category.pk}`}>
            {category.label}
          </Link>
        ) : null;
      },
      editable: true,
      formField: <CategorySelect />,
      formValue: (key, value) => ["set_default_category", value?.pk],
      formName: "set_default_category",
      rules: []
    }
  ];

  return (
    <BaseEditableTable<Payee>
      editable
      onSave={async payee => {
        const isNew = payee.pk === 0;
        try {
          const savedPayee = isNew
            ? await create(payee)
            : await edit(payee, {
                updateQuery: ["item/payees", { pk: payee.pk }]
              });
          message.success(`Payee ${isNew ? "created" : "updated"}`);
          return savedPayee;
        } catch (e) {
          message.error(`Payee ${isNew ? "create" : "update"} failed`);
          throw e;
        }
      }}
      defaultValues={{ type: "business" }}
      itemName="Payee"
      itemNamePlural="Payees"
      useItems={usePayees}
      columns={columns}
      extraRowActions={payee => [
        <Popconfirm
          key="del"
          title={`Delete Tag "${payee.name}"?`}
          okText="Delete"
          okButtonProps={{ type: "danger" }}
          placement="left"
          onConfirm={async () => {
            await doDelete(payee);
            message.info(`Tag "${payee.name}" deleted.`);
          }}
        >
          <Button type="link">Delete</Button>
        </Popconfirm>
      ]}
      bulkActions={[
        {
          key: "delete",
          name: "Delete selected tags",
          async action(pks) {
            const { deleted } = await bulkDelete({ pks });
            message.info(`Deleted ${deleted} payees`);
          }
        }
      ]}
    />
  );
};

export default Payees;
