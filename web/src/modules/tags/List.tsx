import { Button, Divider, message, Popconfirm } from "antd";
import { ColumnsType } from "antd/lib/table/Table";
import React from "react";
import { useMutation } from "react-query";
import { Link, RouteComponentProps } from "react-router-dom";
import Color from "../../components/data/Color";
import { deleteTag, fetchTags, Tag } from "../../dao/tags";
import BaseList from "../base/BaseList";

const Tags = ({ match }: RouteComponentProps) => {
  const [doDeleteTag] = useMutation(deleteTag, {
    refetchQueries: ["items/tags"]
  });

  const columns: ColumnsType<Tag> = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: true,
      render(name, tag) {
        return <Link to={`${match.url}/${tag.pk}`}>#{name}</Link>;
      }
    },
    {
      title: "Color",
      dataIndex: "color",
      render(value) {
        return <Color value={value} />;
      }
    },
    {
      align: "right",
      render(_, tag) {
        return (
          <>
            <Link to={`${match.url}/${tag.pk}/edit`}>Edit</Link>
            <Divider type="vertical" />
            <Popconfirm
              title={`Delete Tag "${tag.label}"?`}
              okText="Delete"
              okButtonProps={{ type: "danger" }}
              placement="left"
              onConfirm={async () => {
                await doDeleteTag(tag);
                message.info(`Tag "${tag.label}" deleted.`);
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
      itemName="Tag"
      itemNamePlural="Tags"
      fetchItems={fetchTags}
      columns={columns}
      extraActions={[<Link to="#">Example</Link>]}
      actions={[
        <Button key="create" type="primary">
          <Link to={`${match.url}/create`}>Create Tag</Link>
        </Button>
      ]}
    />
  );
};

export default Tags;
