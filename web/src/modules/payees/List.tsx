import { Button, Input, message, Popconfirm, Select } from "antd";
import React from "react";
import { useMutation } from "react-query";
import { Link, RouteComponentProps } from "react-router-dom";
import { deletePayee, Payee, putPayee, usePayees } from "../../dao/payees";
import BaseList, { EditableColumnsType } from "../base/BaseList";

const Payees = ({ match }: RouteComponentProps) => {
  const [doDelete] = useMutation(deletePayee, {
    refetchQueries: ["items/payees"]
  });
  const [edit] = useMutation(putPayee);

  const columns: EditableColumnsType<Payee> = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: true,
      editable: true,
      formField: <Input autoFocus />,
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
        <Select>
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
        try {
          const savedPayee = await edit(payee, {
            updateQuery: ["item/payees", { pk: payee.pk }]
          });
          message.success("Payee updated!");
          return savedPayee;
        } catch (e) {
          message.error("Payee update failed!");
          throw e;
        }
      }}
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
      actions={[
        <Button key="create" type="primary">
          <Link to={`${match.url}/create`}>Create Payee</Link>
        </Button>
      ]}
    />
  );
};

export default Payees;
