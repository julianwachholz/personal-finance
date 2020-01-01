import { Button, Input, message, Popconfirm } from "antd";
import React from "react";
import { useMutation } from "react-query";
import { Link, RouteComponentProps } from "react-router-dom";
import Color from "../../components/data/Color";
import ColorInput from "../../components/form/ColorInput";
import { deleteTag, putTag, Tag, useTags } from "../../dao/tags";
import BaseList, { EditableColumnsType } from "../base/BaseList";

const Tags = ({ match }: RouteComponentProps) => {
  const [doDelete] = useMutation(deleteTag, {
    refetchQueries: ["items/tags"]
  });
  const [edit] = useMutation(putTag);

  const columns: EditableColumnsType<Tag> = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: true,
      editable: true,
      formField: <Input autoFocus />,
      render(name, tag) {
        return <Link to={`${match.url}/${tag.pk}`}>#{name}</Link>;
      }
    },
    {
      title: "Color",
      dataIndex: "color",
      editable: true,
      formField: <ColorInput />,
      render(value) {
        return <Color value={value} />;
      }
    }
  ];

  return (
    <BaseList
      editable
      onSave={async tag => {
        try {
          const savedTag = await edit(tag, {
            updateQuery: ["item/tags", { pk: tag.pk }]
          });
          message.success("Tag updated!");
          return savedTag;
        } catch (e) {
          message.error("Tag update failed!");
          throw e;
        }
      }}
      itemName="Tag"
      itemNamePlural="Tags"
      useItems={useTags}
      columns={columns}
      extraActions={[<Link to="#">Example</Link>]}
      extraRowActions={tag => [
        <Popconfirm
          key="del"
          title={`Delete Tag "${tag.label}"?`}
          okText="Delete"
          okButtonProps={{ type: "danger" }}
          placement="left"
          onConfirm={async () => {
            await doDelete(tag);
            message.info(`Tag "${tag.label}" deleted.`);
          }}
        >
          <Button type="link">Delete</Button>
        </Popconfirm>
      ]}
      actions={[
        <Button key="create" type="primary">
          <Link to={`${match.url}/create`}>Create Tag</Link>
        </Button>
      ]}
    />
  );
};

export default Tags;
