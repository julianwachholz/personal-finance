import { Input, InputNumber } from "antd";
import { InputProps } from "antd/lib/input";
import { InputNumberProps } from "antd/lib/input-number";
import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useAuth } from "../../utils/AuthProvider";
import { useSettings } from "../../utils/SettingsProvider";
import { CURRENCY_FORMATS } from "../data/Money";
import "./MoneyInput.scss";

const escapeRegExp = (value: string) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

interface MoneyInputProps extends InputNumberProps {
  currency?: string;
  fullWidth?: boolean;
}

const MoneyInput = ({
  value,
  currency,
  fullWidth,
  ...props
}: MoneyInputProps) => {
  const { tableSize } = useSettings();
  const { settings } = useAuth();
  const [input, setInput] = useState(value as any);
  const currencyFormat = currency ? CURRENCY_FORMATS[currency] : undefined;
  const prefix = currencyFormat?.prefix ?? "";
  const suffix = currencyFormat?.suffix ?? "";

  const decimalSeparator = settings?.decimal_separator ?? ".";
  const groupSeparator = settings?.group_separator ?? "\xa0";

  const rParse = new RegExp(
    `${prefix ? `${escapeRegExp(prefix)}\\s?|` : ""}(\\${groupSeparator}*)${
      suffix ? `|${escapeRegExp(suffix)}` : ""
    }`,
    "g"
  );

  useEffect(() => {
    setInput(value);
  }, [value]);

  if (isMobile) {
    const inputProps: InputProps = {
      ...props,
      onChange(e) {
        const value = e.target.value.replace(",", ".");
        setInput(value);
        props.onChange?.(value ? parseFloat(value) : undefined);
      }
    };
    return (
      <Input
        className={`input-money ${fullWidth && "input-money-fullwidth"}`}
        inputMode="decimal"
        {...inputProps}
        value={input}
        autoComplete="off"
      />
    );
  }
  if (value) {
    value = parseFloat(value as any);
  }

  return (
    <InputNumber
      size={tableSize}
      className={`input-money ${fullWidth && "input-money-fullwidth"}`}
      precision={2}
      decimalSeparator={decimalSeparator}
      parser={v => v!.replace(rParse, "")}
      formatter={v =>
        `${prefix}${v}${suffix}`.replace(
          /\B(?=(\d{3})+(?!\d))/g,
          groupSeparator
        )
      }
      value={value}
      {...props}
    />
  );
};

export default MoneyInput;
