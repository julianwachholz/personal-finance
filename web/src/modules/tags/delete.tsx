import { DeleteTwoTone } from "@ant-design/icons";
import { message, Modal } from "antd";
import { History } from "history";
import React from "react";
import { MutateFunction } from "react-query";
import { Tag } from "../../dao/tags";
import { COLOR_DANGER } from "../../utils/constants";

export const confirmDeleteTag = (
  tag: Tag,
  doDelete: MutateFunction<void, Tag>,
  history: History
) => {
  Modal.confirm({
    title: `Delete Tag "${tag.label}"?`,
    icon: <DeleteTwoTone twoToneColor={COLOR_DANGER} />,
    content:
      "This will delete the tag and remove it from all associated transactions.",
    okText: "Delete",
    okButtonProps: { type: "danger" },
    onOk: async () => {
      await doDelete(tag);
      message.info(`Tag "${tag.label}" deleted`);
      history.push(`/settings/tags`);
    }
  });
};
