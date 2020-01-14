import { Button, Input, message, Popconfirm, Tag } from "antd";
import React from "react";
import { useMutation } from "react-query";
import { Link, RouteComponentProps, useLocation } from "react-router-dom";
import ColorSelect from "../../components/form/ColorSelect";
import {
  bulkDeleteTags,
  deleteTag,
  postTag,
  putTag,
  Tag as TagModel,
  useTags
} from "../../dao/tags";
import { useSettings } from "../../utils/SettingsProvider";
import BaseEditableTable from "../base/BaseEditableTable";
import { BaseTableLocationState, getColumnSort } from "../base/BaseTable";
import { EditableColumnsType } from "../base/EditableTable";

const TagTable = ({ match }: RouteComponentProps) => {
  const { tableSize } = useSettings();
  const [doDelete] = useMutation(deleteTag, {
    refetchQueries: ["items/tags"]
  });
  const [edit] = useMutation(putTag);
  const [create] = useMutation(postTag);
  const [bulkDelete] = useMutation(bulkDeleteTags, {
    refetchQueries: ["items/tags"]
  });

  const location = useLocation<BaseTableLocationState>();
  const columns: EditableColumnsType<TagModel> = [
    {
      title: "Name",
      dataIndex: "name",
      editable: true,
      formField: <Input size={tableSize} autoFocus prefix="#" />,
      render(name, tag) {
        return <Link to={`${match.url}/${tag.pk}`}>#{name}</Link>;
      },
      ...getColumnSort("name", location.state)
    },
    {
      title: "Color",
      dataIndex: "color",
      editable: true,
      rules: [],
      formField: <ColorSelect />,
      render(color, tag) {
        return <Tag color={color}>{tag.label}</Tag>;
      }
    }
  ];

  return (
    <BaseEditableTable
      editable
      onSave={async tag => {
        const isNew = tag.pk === 0;
        try {
          const savedTag = isNew
            ? await create(tag)
            : await edit(tag, {
                updateQuery: ["item/tags", { pk: tag.pk }]
              });
          message.success(`Tag ${isNew ? "created" : "updated"}`);
          return savedTag;
        } catch (e) {
          message.error(`Tag ${isNew ? "create" : "update"} failed`);
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
      bulkActions={[
        {
          key: "delete",
          name: "Delete selected tags",
          async action(pks) {
            const { deleted } = await bulkDelete({ pks });
            message.info(`Deleted ${deleted} tags`);
          }
        }
      ]}
    />
  );
};

export default TagTable;
