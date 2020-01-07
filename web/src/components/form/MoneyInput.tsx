import InputNumber, { InputNumberProps } from "antd/lib/input-number";
import React from "react";
import { useAuth } from "../../utils/AuthProvider";
import { useSettings } from "../../utils/SettingsProvider";
import "./MoneyInput.scss";

interface MoneyInputProps extends InputNumberProps {
  fullWidth?: boolean;
}

const MoneyInput = ({ value, fullWidth, ...props }: MoneyInputProps) => {
  const { tableSize } = useSettings();
  const { settings } = useAuth();
  if (value) {
    value = parseFloat(value as any);
  }
  const decimalSeparator = settings?.decimal_separator ?? ".";
  const groupSeparator = settings?.group_separator ?? "\xa0";

  const rParse = new RegExp(`(\\${groupSeparator}*)`, "g");

  return (
    <InputNumber
      size={tableSize}
      className={`input-money ${fullWidth && "input-money-fullwidth"}`}
      precision={2}
      decimalSeparator={decimalSeparator}
      formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator)}
      parser={v => v!.replace(rParse, "")}
      value={value}
      {...props}
    />
  );
};

export default MoneyInput;
