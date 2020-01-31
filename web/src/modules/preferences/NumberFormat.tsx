import { Radio } from "antd";
import { RadioGroupProps } from "antd/lib/radio";
import React from "react";
import { Settings } from "../../dao/settings";

interface NumberFormat {
  label: string;
  decimal_separator: string;
  group_separator: string;
}

export type NumberFormatName = "default" | "american" | "german" | "swiss";

type NumberFormats = {
  [F in NumberFormatName]: NumberFormat;
};

export const numberFormats: NumberFormats = {
  default: {
    label: "1 000.99",
    decimal_separator: ".",
    group_separator: "\xa0"
  },
  american: {
    label: "1,000.99",
    decimal_separator: ".",
    group_separator: ","
  },
  german: {
    label: "1.000,99",
    decimal_separator: ",",
    group_separator: "."
  },
  swiss: {
    label: "1'000.99",
    decimal_separator: ".",
    group_separator: "'"
  }
};

export const getNumberFormat = (settings: Settings): NumberFormatName => {
  const match = Object.entries(numberFormats).find(
    ([k, f]) =>
      f.group_separator === settings.group_separator &&
      f.decimal_separator === settings.decimal_separator
  );
  if (match) {
    return match[0] as NumberFormatName;
  }
  return "default";
};

export const NumberFomat = (props: RadioGroupProps) => {
  return (
    <Radio.Group {...props}>
      {Object.entries(numberFormats).map(([k, v]) => (
        <Radio.Button key={k} value={k}>
          {v.label}
        </Radio.Button>
      ))}
    </Radio.Group>
  );
};

export default NumberFomat;
