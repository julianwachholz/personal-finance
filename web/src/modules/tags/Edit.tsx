import { message, Spin } from "antd";
import React from "react";
import { useMutation } from "react-query";
import { RouteComponentProps, useHistory } from "react-router";
import { putTag, useTag } from "../../dao/tags";
import BaseModule from "../base/BaseModule";
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
  const history = useHistory();

  if (!data || isLoading) {
    return <Spin />;
  }

  return (
    <BaseModule title={`Edit ${data.label}`}>
      <TagForm
        data={data}
        onSave={async data => {
          try {
            await mutate({ pk, ...data }, { updateQuery: ["Tag", { pk }] });
            message.success("Tag updated!");
            history.push(`/settings/tags/${pk}`);
          } catch (e) {
            message.error("Tag update failed!");
          }
        }}
      />
    </BaseModule>
  );
};

export default TagEdit;
