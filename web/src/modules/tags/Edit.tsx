import { DeleteFilled } from "@ant-design/icons";
import { message, Spin } from "antd";
import React from "react";
import { useMutation } from "react-query";
import { RouteComponentProps, useHistory, useLocation } from "react-router";
import { deleteTag, putTag, useTag } from "../../dao/tags";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";
import { confirmDeleteTag } from "./delete";
import TagForm from "./Form";

interface DetailParams {
  pk: string;
}

const TagEdit = ({ match }: RouteComponentProps<DetailParams>) => {
  const pk = parseInt(match.params.pk, 10);
  const { data: tag, isLoading } = useTag(pk);

  const [mutate] = useMutation(putTag, {
    refetchQueries: ["items/tags"]
  });
  const [doDelete] = useMutation(deleteTag, {
    refetchQueries: ["items/tags"]
  });
  const history = useHistory();
  const location = useLocation();
  useTitle(tag && `Edit ${tag.label}`);

  if (!tag || isLoading) {
    return <Spin />;
  }

  return (
    <BaseModule
      title={`Edit ${tag.label}`}
      onLeftClick={() => {
        history.go(location.state?.back ?? -2);
      }}
      rightContent={
        <DeleteFilled
          onClick={() => {
            confirmDeleteTag(tag, doDelete, history);
          }}
        />
      }
    >
      <TagForm
        data={tag}
        onSave={async data => {
          try {
            await mutate(data, { updateQuery: ["item/tags", { pk }] });
            message.success("Tag updated");
            history.push(`/settings/tags`);
          } catch (e) {
            message.error("Tag update failed");
            throw e;
          }
        }}
      />
    </BaseModule>
  );
};

export default TagEdit;
