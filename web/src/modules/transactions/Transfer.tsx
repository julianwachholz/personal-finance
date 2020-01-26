import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";
import { TransferForm } from "./TransferForm";

const BalanceTransfer = () => {
  const [t] = useTranslation("transactions");
  const history = useHistory();

  useTitle(t("transactions:transfer.title", "Balance Transfer"));
  return (
    <BaseModule
      title={t("transactions:transfer.title", "Balance Transfer")}
      onLeftClick={() => {
        history.go(-1);
      }}
    >
      <TransferForm
        onFinish={() => {
          history.push(`/transactions`);
        }}
      />
    </BaseModule>
  );
};

export default BalanceTransfer;
