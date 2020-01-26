import { DeleteTwoTone } from "@ant-design/icons";
import { message, Modal } from "antd";
import { History } from "history";
import { TFunction } from "i18next";
import React from "react";
import { MutateFunction } from "react-query";
import DateTime from "../../components/data/Date";
import Money from "../../components/data/Money";
import { Transaction } from "../../dao/transactions";
import { COLOR_DANGER } from "../../utils/constants";

export const confirmDeleteTransaction = (
  tx: Transaction,
  doDelete: MutateFunction<void, Transaction>,
  t: TFunction,
  history?: History
) => {
  Modal.confirm({
    title: t("transactions:delete", "Delete Transaction?"),
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
          {t(
            "transactions:delete_warning",
            "This will delete the transaction and remove the balance from its associated account."
          )}
        </p>
      </>
    ),
    okText: t("translation:delete", "Delete"),
    okButtonProps: { type: "danger" },
    cancelText: t("translation:cancel", "Cancel"),
    onOk: async () => {
      await doDelete(tx);
      message.info(
        t("transactions:deleted", "Transaction #{{ id }} deleted", {
          id: tx.pk
        })
      );
      history?.push(`/transactions`);
    }
  });
};
