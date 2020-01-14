import { DeleteTwoTone } from "@ant-design/icons";
import { message, Modal } from "antd";
import { History } from "history";
import React from "react";
import { MutateFunction } from "react-query";
import { Payee } from "../../dao/payees";
import { COLOR_DANGER } from "../../utils/constants";

export const confirmDeletePayee = (
  payee: Payee,
  doDelete: MutateFunction<void, Payee>,
  history: History
) => {
  Modal.confirm({
    title: `Delete Payee "${payee.label}"?`,
    icon: <DeleteTwoTone twoToneColor={COLOR_DANGER} />,
    content:
      "This will delete the payee and remove it from all associated transactions.",
    okText: "Delete",
    okButtonProps: { type: "danger" },
    onOk: async () => {
      await doDelete(payee);
      message.info(`Payee "${payee.label}" deleted`);
      history.push(`/settings/payees`);
    }
  });
};
