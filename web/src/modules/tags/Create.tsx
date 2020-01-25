import { message } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { setQueryData, useMutation } from "react-query";
import { useHistory } from "react-router";
import { postTag } from "../../dao/tags";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";
import TagForm from "./Form";

const TagCreate = () => {
  const [t] = useTranslation("tags");
  const [mutate] = useMutation(postTag, {
    refetchQueries: ["items/tags"]
  });
  const history = useHistory();

  useTitle(t("tags:tag_create", "Create Tag"));
  return (
    <BaseModule
      title={t("tags:tag_create", "Create Tag")}
      onLeftClick={() => {
        history.go(-1);
      }}
    >
      <TagForm
        onSave={async data => {
          try {
            const tag = await mutate(data);
            setQueryData(["item/tags", { pk: tag.pk }], tag);
            message.success(t("tags:tag_created", "Tag created"));
            history.push(`/settings/tags`);
          } catch (e) {
            message.error(t("tags:tag_create_error", "Tag create failed"));
            throw e;
          }
        }}
      />
    </BaseModule>
  );
};

export default TagCreate;
