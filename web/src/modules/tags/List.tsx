import { Button, Divider, message, Popconfirm, Table } from "antd";
import React from "react";
import { useMutation } from "react-query";
import { Link, RouteComponentProps } from "react-router-dom";
import Color from "../../components/data/Color";
import { deleteTag, fetchTags } from "../../dao/tags";
import BaseList from "../base/BaseList";

const { Column } = Table;

const Tags: React.FC<RouteComponentProps> = ({ match }) => {
  const [doDeleteTag] = useMutation(deleteTag, {
    refetchQueries: ["Tags"]
  });

  return (
    <BaseList
      itemName="Tag"
      itemNamePlural="Tags"
      fetchItems={fetchTags}
      extraActions={[<Link to="#">Example</Link>]}
      actions={[
        <Button key="create" type="primary">
          <Link to={`${match.url}/create`}>Create Tag</Link>
        </Button>
      ]}
    >
      <Column
        title="Name"
        dataIndex="name"
        sorter
        render={(name, tag: any) => (
          <Link to={`${match.url}/${tag.pk}`}>#{name}</Link>
        )}
      />
      <Column
        title="Color"
        dataIndex="color"
        render={value => <Color value={value} />}
      />
      <Column
        align="right"
        render={tag => (
          <>
            <Link to={`${match.url}/${tag.pk}/edit`}>Edit</Link>
            <Divider type="vertical" />
            <Popconfirm
              title={`Delete Tag "${tag.label}"?`}
              okText="Delete"
              okButtonProps={{ type: "danger" }}
              placement="left"
              onConfirm={async () => {
                try {
                  await doDeleteTag(tag);
                  message.info(`Tag "${tag.label}" deleted.`);
                } catch (e) {
                  message.error("Failed to delete tag!");
                }
              }}
            >
              <Button type="link">Delete</Button>
            </Popconfirm>
          </>
        )}
      />
    </BaseList>
  );
};

export default Tags;
