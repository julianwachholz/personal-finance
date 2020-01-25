import { DeleteTwoTone } from "@ant-design/icons";
import { message, Modal } from "antd";
import { History } from "history";
import { TFunction } from "i18next";
import React from "react";
import { MutateFunction } from "react-query";
import { Tag } from "../../dao/tags";
import { COLOR_DANGER } from "../../utils/constants";

export const confirmDeleteTag = (
  tag: Tag,
  doDelete: MutateFunction<void, Tag>,
  t: TFunction,
  history?: History
) => {
  Modal.confirm({
    title: t("tags:tag_delete", 'Delete Tag "{{ label }}"?', {
      label: tag.label
    }),
    icon: <DeleteTwoTone twoToneColor={COLOR_DANGER} />,
    content: t(
      "tags:tag_delete_warning",
      "This will delete the tag and remove it from all associated transactions."
    ),
    okText: t("translation:delete", "Delete"),
    okButtonProps: { type: "danger" },
    onOk: async () => {
      await doDelete(tag);
      message.info(
        t("tags:tag_deleted", 'Tag "{{ label }}" deleted', { label: tag.label })
      );
      history?.push(`/settings/tags`);
    }
  });
};
