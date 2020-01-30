import { Select } from "antd";
import { SelectProps } from "antd/lib/select";
import React from "react";
import { CURRENCY_FORMATS } from "../data/Money";
import "./CurrencySelect.scss";

const options = Object.entries(CURRENCY_FORMATS).map(([code, currency]) => ({
  key: code,
  value: code,
  label: (
    <span
      data-search={
        currency.code.toLowerCase() + " " + currency.name.toLowerCase()
      }
    >
      <span className="currency-code">{code}</span> {currency.name}
      <span className="currency-symbol">
        {currency.prefix}
        {currency.suffix}
      </span>
    </span>
  )
}));

const CurrencySelect = (props: SelectProps<string>) => {
  return (
    <Select
      showSearch
      filterOption={(value, option: any) =>
        option?.label?.props["data-search"].includes(value.toLowerCase())
      }
      className="currency-select"
      optionLabelProp="value"
      options={options}
      {...props}
    />
  );
};

export default CurrencySelect;
