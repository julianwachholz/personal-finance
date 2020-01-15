import React from "react";
import { useHistory } from "react-router";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";
import TransferForm from "./TransferForm";

const BalanceTransfer = () => {
  const history = useHistory();

  useTitle(`Balance Transfer`);
  return (
    <BaseModule
      title="Balance Transfer"
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
