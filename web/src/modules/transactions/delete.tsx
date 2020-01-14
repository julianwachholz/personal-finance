import { DeleteTwoTone } from "@ant-design/icons";
import { message, Modal } from "antd";
import { History } from "history";
import React from "react";
import { MutateFunction } from "react-query";
import DateTime from "../../components/data/Date";
import Money from "../../components/data/Money";
import { Transaction } from "../../dao/transactions";
import { COLOR_DANGER } from "../../utils/constants";

export const confirmDeleteTransaction = (
  tx: Transaction,
  doDelete: MutateFunction<void, Transaction>,
  history: History
) => {
  Modal.confirm({
    title: `Delete Transaction?`,
    icon: <DeleteTwoTone twoToneColor={COLOR_DANGER} />,
    content: (
      <>
        <p>
          <DateTime value={tx.datetime} />
          {", "}
          <Money value={{ amount: tx.amount, currency: tx.amount_currency }} />
          <br />
          {[tx.category?.label, tx.payee?.label, tx.text]
            .filter(Boolean)
            .join(", ")}
        </p>
        <p>
          This will delete the transaction and remove the balance from its
          associated account.
        </p>
      </>
    ),
    okText: "Delete",
    okButtonProps: { type: "danger" },
    onOk: async () => {
      await doDelete(tx);
      message.info(`Transaction #${tx.pk} deleted`);
      history.push(`/transactions`);
    }
  });
};
