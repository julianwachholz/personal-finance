import { message } from "antd";
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
  const { data } = useTag(pk);

  const [mutate] = useMutation(putTag, {
    refetchQueries: ["items/tags"]
  });
  const history = useHistory();

  return (
    data && (
      <BaseModule title={`Edit ${data.label}`}>
        <TagForm
          data={data}
          onSave={async data => {
            try {
              await mutate(
                { pk, ...data },
                { updateQuery: ["item/tags", { pk }] }
              );
              message.success("Tag updated!");
              history.push(`/settings/tags/${pk}`);
            } catch (e) {
              message.error("Tag update failed!");
            }
          }}
        />
      </BaseModule>
    )
  );
};

export default TagEdit;
