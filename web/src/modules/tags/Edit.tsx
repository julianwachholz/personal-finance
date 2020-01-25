import { DeleteFilled } from "@ant-design/icons";
import { message, Spin } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { RouteComponentProps } from "react-router";
import { deleteTag, putTag, useTag } from "../../dao/tags";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";
import { confirmDeleteTag } from "./delete";
import TagForm from "./Form";

interface DetailParams {
  pk: string;
}

const TagEdit = ({
  match,
  location,
  history
}: RouteComponentProps<DetailParams, {}, { back?: number }>) => {
  const [t] = useTranslation("tags");
  const pk = parseInt(match.params.pk, 10);
  const { data: tag, isLoading } = useTag(pk);

  const [mutate] = useMutation(putTag, {
    refetchQueries: ["items/tags"]
  });
  const [doDelete] = useMutation(deleteTag, {
    refetchQueries: ["items/tags"]
  });
  useTitle(tag && t("tags:tag_edit", "Edit {{ label }}", { label: tag.label }));

  if (!tag || isLoading) {
    return <Spin />;
  }

  return (
    <BaseModule
      title={t("tags:tag_edit", "Edit {{ label }}", { label: tag.label })}
      onLeftClick={() => {
        history.go(location.state?.back ?? -2);
      }}
      rightContent={
        <DeleteFilled
          onClick={() => {
            confirmDeleteTag(tag, doDelete, t, history);
          }}
        />
      }
    >
      <TagForm
        data={tag}
        onSave={async data => {
          try {
            await mutate(data, { updateQuery: ["item/tags", { pk }] });
            message.success(t("tags:tag_updated", "Tag updated"));
            history.push(`/settings/tags`);
          } catch (e) {
            message.error(t("tags:tag_update_error", "Tag update failed"));
            throw e;
          }
        }}
      />
    </BaseModule>
  );
};

export default TagEdit;
