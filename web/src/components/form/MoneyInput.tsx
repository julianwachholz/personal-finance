import { Input, InputNumber, Select } from "antd";
import { InputNumberProps } from "antd/lib/input-number";
import React from "react";
import { Money } from "../data/Money";
import "./MoneyInput.scss";

type BaseProps = Omit<InputNumberProps, "value" | "onChange">;

interface MoneyInputProps extends BaseProps {
  value?: Money;
  isNegative?: boolean;
  onChange?: (value?: Partial<Money>) => void;
}

const MoneyInput = React.forwardRef(
  (
    {
      value,
      isNegative = false,
      onChange = () => {},
      ...props
    }: MoneyInputProps,
    ref
  ) => {
    const triggerChange = (changed: Partial<Money>) => {
      if (!changed.amount && !changed.currency) {
        onChange();
      } else {
        onChange({ ...value, ...changed });
      }
    };

    if (!value) {
      value = { amount: "0", currency: "CHF" }; // @TODO default currency
    }

    return (
      <Input.Group compact className="input-money">
        <InputNumber
          className="input-money-amount"
          ref={ref as any}
          min={0}
          precision={2}
          defaultValue={parseFloat(value.amount)}
          onChange={amount =>
            amount === null || amount!.toString() === ""
              ? triggerChange({})
              : triggerChange({ amount: amount!.toString() })
          }
          formatter={v =>
            `${isNegative ? "-" : "+"}${v}`.replace(
              /\B(?=(\d{3})+(?!\d))/g,
              ","
            )
          }
          parser={v => v!.replace(/-|\+\s?|(,*)/g, "")}
          {...props}
        />
        <Select
          showSearch
          defaultActiveFirstOption={false}
          defaultValue={value.currency}
          onChange={(currency: string) => triggerChange({ currency })}
          className="input-money-currency"
        >
          <Select.Option value="EUR">EUR</Select.Option>
          <Select.Option value="USD">USD</Select.Option>
          <Select.Option value="CHF">CHF</Select.Option>
          <Select.Option value="JPY">JPY</Select.Option>
          <Select.Option value="PLN">PLN</Select.Option>
        </Select>
      </Input.Group>
    );
  }
);

export default MoneyInput;
