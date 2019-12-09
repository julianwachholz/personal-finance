import { message, Spin } from "antd";
import React from "react";
import { useMutation } from "react-query";
import { RouteComponentProps } from "react-router";
import { putTag, useTag } from "../../dao/tags";
import TagForm from "./Form";

interface IDetailParams {
  pk: string;
}
const TagEdit: React.FC<RouteComponentProps<IDetailParams>> = ({ match }) => {
  const pk = parseInt(match.params.pk, 10);
  const { data, isLoading } = useTag(pk);

  const [mutate] = useMutation(putTag, {
    refetchQueries: ["Tags"]
  });

  if (!data || isLoading) {
    return <Spin />;
  }

  return (
    <TagForm
      data={data}
      onSave={async data => {
        try {
          await mutate({ pk, ...data }, { updateQuery: ["Tag", { pk }] });
          message.success("Tag updated!");
        } catch (e) {
          message.error("Tag update failed!");
        }
      }}
    />
  );
};

export default TagEdit;
