import { message } from "antd";
import React from "react";
import { setQueryData, useMutation } from "react-query";
import { useHistory } from "react-router";
import { postTag } from "../../dao/tags";
import BaseModule from "../base/BaseModule";
import TagForm from "./Form";

const TagCreate: React.FC = () => {
  const [mutate] = useMutation(postTag, {
    refetchQueries: ["items/tags"]
  });
  const history = useHistory();

  return (
    <BaseModule title="Create Tag">
      <TagForm
        onSave={async data => {
          try {
            const tag = await mutate(data);
            setQueryData(["item/tags", { pk: tag.pk }], tag);
            message.success("Tag created!");
            history.push(`/settings/tags/${tag.pk}`);
          } catch (e) {
            message.error("Tag create failed!");
          }
        }}
      />
    </BaseModule>
  );
};

export default TagCreate;
