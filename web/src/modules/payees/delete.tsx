import { DeleteTwoTone } from "@ant-design/icons";
import { message, Modal } from "antd";
import { History } from "history";
import { TFunction } from "i18next";
import React from "react";
import { MutateFunction } from "react-query";
import { Payee } from "../../dao/payees";
import { COLOR_DANGER } from "../../utils/constants";

export const confirmDeletePayee = (
  payee: Payee,
  doDelete: MutateFunction<void, Payee>,
  t: TFunction,
  history?: History
) => {
  Modal.confirm({
    title: t("payees:delete", 'Delete Payee "{{ label }}"?', {
      label: payee.label
    }),
    icon: <DeleteTwoTone twoToneColor={COLOR_DANGER} />,
    content: t(
      "payees:delete_warning",
      "This will delete the payee and remove it from all associated transactions."
    ),
    okText: t("translation:delete", "Delete"),
    okButtonProps: { type: "danger" },
    cancelText: t("translation:cancel", "Cancel"),
    onOk: async () => {
      await doDelete(payee);
      message.info(
        t("payees:deleted", 'Payee "{{ label }}" deleted', {
          label: payee.label
        })
      );
      history?.push(`/settings/payees`);
    }
  });
};
