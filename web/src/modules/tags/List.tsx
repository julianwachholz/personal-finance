import { Button, Input, message, Popconfirm, Tag } from "antd";
import React from "react";
import { useMutation } from "react-query";
import { Link, RouteComponentProps } from "react-router-dom";
import ColorSelect from "../../components/form/ColorSelect";
import {
  deleteTag,
  postTag,
  putTag,
  Tag as TagModel,
  useTags
} from "../../dao/tags";
import { useSettings } from "../../utils/SettingsProvider";
import BaseList, { EditableColumnsType } from "../base/BaseList";

const Tags = ({ match }: RouteComponentProps) => {
  const { tableSize } = useSettings();
  const [doDelete] = useMutation(deleteTag, {
    refetchQueries: ["items/tags"]
  });
  const [edit] = useMutation(putTag);
  const [create] = useMutation(postTag);

  const columns: EditableColumnsType<TagModel> = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: true,
      editable: true,
      formField: <Input autoFocus prefix="#" size={tableSize} />,
      render(name, tag) {
        return <Link to={`${match.url}/${tag.pk}`}>#{name}</Link>;
      }
    },
    {
      title: "Color",
      dataIndex: "color",
      editable: true,
      rules: [],
      formField: <ColorSelect />,
      render(color) {
        return <Tag color={color}>{color}</Tag>;
      }
    }
  ];

  return (
    <BaseList
      editable
      onSave={async tag => {
        const isNew = tag.pk === 0;
        try {
          const savedTag = isNew
            ? await create(tag)
            : await edit(tag, {
                updateQuery: ["item/tags", { pk: tag.pk }]
              });
          message.success(`Tag ${isNew ? "created" : "updated"}!`);
          return savedTag;
        } catch (e) {
          message.error(`Tag ${isNew ? "create" : "update"} failed!`);
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
    />
  );
};

export default Tags;
