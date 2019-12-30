import { Button, Divider, message, Popconfirm } from "antd";
import { ColumnsType } from "antd/lib/table/Table";
import React from "react";
import { useMutation } from "react-query";
import { Link, RouteComponentProps } from "react-router-dom";
import { deletePayee, fetchPayees, Payee } from "../../dao/payees";
import BaseList from "../base/BaseList";

const Payees = ({ match }: RouteComponentProps) => {
  const [doDelete] = useMutation(deletePayee, {
    refetchQueries: ["items/payees"]
  });

  const columns: ColumnsType<Payee> = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: true,
      render(name, tag) {
        return <Link to={`${match.url}/${tag.pk}`}>{name}</Link>;
      }
    },
    {
      title: "Type",
      dataIndex: "type",
      filterMultiple: false,
      filters: [
        { text: "Business", value: "business" },
        { text: "Private", value: "private" }
      ]
    },
    {
      align: "right",
      render(_, payee) {
        return (
          <>
            <Link to={`${match.url}/${payee.pk}/edit`}>Edit</Link>
            <Divider type="vertical" />
            <Popconfirm
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
          </>
        );
      }
    }
  ];

  return (
    <BaseList
      itemName="Payee"
      itemNamePlural="Payees"
      fetchItems={fetchPayees}
      columns={columns}
      tableProps={{ size: "small" }}
      actions={[
        <Button key="create" type="primary">
          <Link to={`${match.url}/create`}>Create Payee</Link>
        </Button>
      ]}
    />
  );
};

export default Payees;
