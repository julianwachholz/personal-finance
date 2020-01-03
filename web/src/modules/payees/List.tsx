import { Button, Input, message, Popconfirm, Select } from "antd";
import React from "react";
import { useMutation } from "react-query";
import { Link, RouteComponentProps } from "react-router-dom";
import {
  deletePayee,
  Payee,
  postPayee,
  putPayee,
  usePayees
} from "../../dao/payees";
import { useSettings } from "../../utils/SettingsProvider";
import BaseList, { EditableColumnsType } from "../base/BaseList";

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
      formField: (
        <Input size={tableSize === "small" ? "small" : "default"} autoFocus />
      ),
      render(name, tag) {
        return <Link to={`${match.url}/${tag.pk}`}>{name}</Link>;
      }
    },
    {
      title: "Type",
      dataIndex: "type",
      width: 200,
      render(type) {
        return type === "business" ? "Business" : "Private";
      },
      editable: true,
      formField: (
        <Select size={tableSize === "small" ? "small" : "default"}>
          <Select.Option value="business">Business</Select.Option>
          <Select.Option value="private">Private</Select.Option>
        </Select>
      ),
      filterMultiple: false,
      filters: [
        { text: "Business", value: "business" },
        { text: "Private", value: "private" }
      ]
    }
  ];

  return (
    <BaseList<Payee>
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
