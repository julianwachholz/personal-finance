import { Button, Input, message, Popconfirm, Select } from "antd";
import React from "react";
import { useMutation } from "react-query";
import { Link, RouteComponentProps } from "react-router-dom";
import CategorySelect from "../../components/form/CategorySelect";
import { ModelWithLabel } from "../../dao/base";
import {
  deletePayee,
  Payee,
  postPayee,
  putPayee,
  usePayees
} from "../../dao/payees";
import { useSettings } from "../../utils/SettingsProvider";
import BaseEditableList, {
  EditableColumnsType
} from "../base/BaseEditableList";

const Payees = ({ match }: RouteComponentProps) => {
  const { tableSize } = useSettings();
  const [doDelete] = useMutation(deletePayee, {
    refetchQueries: ["items/payees"]
  });
  const [edit] = useMutation(putPayee);
  const [create] = useMutation(postPayee);

  const columns: EditableColumnsType<Payee> = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: true,
      editable: true,
      formField: <Input autoFocus size={tableSize} />,
      render(name, tag) {
        return <Link to={`${match.url}/${tag.pk}`}>{name}</Link>;
      }
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
      ]
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
    <BaseEditableList<Payee>
      editable
      onSave={async payee => {
        const isNew = payee.pk === 0;
        try {
          const savedPayee = isNew
            ? await create(payee)
            : await edit(payee, {
                updateQuery: ["item/payees", { pk: payee.pk }]
              });
          message.success(`Payee ${isNew ? "created" : "updated"}!`);
          return savedPayee;
        } catch (e) {
          message.error(`Payee ${isNew ? "create" : "update"} failed!`);
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
    />
  );
};

export default Payees;
