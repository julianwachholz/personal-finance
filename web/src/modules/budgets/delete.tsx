import { DeleteTwoTone } from "@ant-design/icons";
import { message, Modal } from "antd";
import { History } from "history";
import { TFunction } from "i18next";
import React from "react";
import { MutateFunction } from "react-query";
import { Budget } from "../../dao/budgets";
import { COLOR_DANGER } from "../../utils/constants";

export const confirmDeleteBudget = (
  budget: Budget,
  doDelete: MutateFunction<void, Budget>,
  t: TFunction,
  history?: History
) => {
  Modal.confirm({
    title: t("budgets:delete", 'Delete Budget "{{ label }}"?', {
      label: budget.label
    }),
    icon: <DeleteTwoTone twoToneColor={COLOR_DANGER} />,
    content: t(
      "budgets:delete_warning",
      "This will delete the budget irrevocably."
    ),
    okText: t("translation:delete", "Delete"),
    okButtonProps: { type: "danger" },
    onOk: async () => {
      await doDelete(budget);
      message.info(
        t("budgets:deleted", 'Budget "{{ label }}" deleted', {
          label: budget.label
        })
      );
      history?.push(`/budgets`);
    }
  });
};
