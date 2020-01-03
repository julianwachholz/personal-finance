import { Select } from "antd";
import { SelectProps } from "antd/lib/select";
import React from "react";

const CurrencySelect = (props: SelectProps<string>) => {
  return (
    <Select
      showSearch
      defaultActiveFirstOption={false}
      className="input-money-currency"
      {...props}
    >
      <Select.Option value="EUR">EUR</Select.Option>
      <Select.Option value="USD">USD</Select.Option>
      <Select.Option value="CHF">CHF</Select.Option>
      <Select.Option value="JPY">JPY</Select.Option>
      <Select.Option value="PLN">PLN</Select.Option>
    </Select>
  );
};

export default CurrencySelect;
