import React from "react";
import TagForm from "./Form";
import { useMutation } from "react-query";
import { postTag } from "../../dao/tags";
import { message } from "antd";

const TagCreate: React.FC = () => {
  const [mutate] = useMutation(postTag, {
    refetchQueries: ["Tags"]
  });

  return (
    <TagForm
      onSave={async data => {
        try {
          await mutate(data);
          message.success("Tag created!");
        } catch (e) {
          message.error("Tag create failed!");
        }
      }}
    />
  );
};
export default TagCreate;
