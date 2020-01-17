import { DeleteTwoTone } from "@ant-design/icons";
import { message, Modal } from "antd";
import { History } from "history";
import React from "react";
import { MutateFunction } from "react-query";
import { Budget } from "../../dao/budgets";
import { COLOR_DANGER } from "../../utils/constants";

export const confirmDeleteBudget = (
  budget: Budget,
  doDelete: MutateFunction<void, Budget>,
  history?: History
) => {
  Modal.confirm({
    title: `Delete Budget "${budget.label}"?`,
    icon: <DeleteTwoTone twoToneColor={COLOR_DANGER} />,
    content: "This will delete the budget irrevocably.",
    okText: "Delete",
    okButtonProps: { type: "danger" },
    onOk: async () => {
      await doDelete(budget);
      message.info(`Budget "${budget.label}" deleted`);
      history?.push(`/budgets`);
    }
  });
};
