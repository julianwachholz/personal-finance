import { message } from "antd";
import React from "react";
import { setQueryData, useMutation } from "react-query";
import { useHistory } from "react-router";
import { postTag } from "../../dao/tags";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";
import TagForm from "./Form";

const TagCreate = () => {
  const [mutate] = useMutation(postTag, {
    refetchQueries: ["items/tags"]
  });
  const history = useHistory();

  useTitle(`Create Tag`);
  return (
    <BaseModule
      title="Create Tag"
      onLeftClick={() => {
        history.go(-1);
      }}
    >
      <TagForm
        onSave={async data => {
          try {
            const tag = await mutate(data);
            setQueryData(["item/tags", { pk: tag.pk }], tag);
            message.success("Tag created");
            history.push(`/settings/tags`);
          } catch (e) {
            message.error("Tag creation failed");
            throw e;
          }
        }}
      />
    </BaseModule>
  );
};

export default TagCreate;
