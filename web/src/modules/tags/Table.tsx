import { Button, Input, message, Popconfirm, Tag } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
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
  const [t] = useTranslation("tags");
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
      title: t("tags:name", "Name"),
      dataIndex: "name",
      editable: true,
      formField: <Input size={tableSize} autoFocus prefix="#" />,
      render(name, tag) {
        return <Link to={`${match.url}/${tag.pk}`}>#{name}</Link>;
      },
      ...getColumnSort("name", location.state)
    },
    {
      title: t("tags:color", "Color"),
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
          if (isNew) {
            message.success(t("tags:created", "Tag created"));
          } else {
            message.success(t("tags:updated", "Tag updated"));
          }
          return savedTag;
        } catch (e) {
          if (isNew) {
            message.error(t("tags:create_error", "Tag create failed"));
          } else {
            message.error(t("tags:update_error", "Tag update failed"));
          }
          throw e;
        }
      }}
      itemName={t("tags:tag", "Tag")}
      itemNamePlural={t("tags:tag_plural", "Tags")}
      useItems={useTags}
      columns={columns}
      extraRowActions={tag => [
        <Popconfirm
          key="del"
          title={t("tags:delete", 'Delete Tag "{{ label }}"?', {
            label: tag.label
          })}
          okText={t("translation:delete", "Delete")}
          okButtonProps={{ type: "danger" }}
          cancelText={t("translation:cancel", "Cancel")}
          placement="left"
          onConfirm={async () => {
            await doDelete(tag);
            message.info(
              t("tags:deleted", 'Tag "{{ label }}" deleted', {
                label: tag.label
              })
            );
          }}
        >
          <Button type="link">{t("translation:delete", "Delete")}</Button>
        </Popconfirm>
      ]}
      bulkActions={[
        {
          key: "delete",
          name: t("tags:bulk.delete", "Delete selected tags"),
          async action(pks) {
            const { deleted } = await bulkDelete({ pks });
            message.info(
              t("tags:bulk.deleted", "Deleted {{ count }} tags", {
                count: deleted
              })
            );
          }
        }
      ]}
    />
  );
};

export default TagTable;
