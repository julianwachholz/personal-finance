import { InputNumberProps } from "antd/lib/input-number";
import React from "react";
import "./MoneyInput.scss";
import { SizedInputNumber } from "./SizedInput";

const MoneyInput = ({ value, ...props }: InputNumberProps) => {
  if (value) {
    value = parseFloat(value as any);
  }
  return (
    <SizedInputNumber
      className="input-money"
      precision={2}
      formatter={v =>
        `${value && value > 0 ? "+" : ""}${v}`.replace(
          /\B(?=(\d{3})+(?!\d))/g,
          ","
        )
      }
      parser={v => v!.replace(/\+\s?|(,*)/g, "")}
      value={value}
      {...props}
    />
  );
};

export default MoneyInput;
