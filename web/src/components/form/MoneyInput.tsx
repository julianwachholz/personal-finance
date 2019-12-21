import { Input, InputNumber, Select } from "antd";
import React from "react";
import { Money } from "../data/Money";
import "./MoneyInput.scss";

interface MoneyInputProps {
  value?: Money;
  onChange?: (value?: Partial<Money>) => void;
  autoFocus?: boolean;
}

const MoneyInput = React.forwardRef(
  ({ value, onChange = () => {}, ...props }: MoneyInputProps, ref) => {
    const triggerChange = (changed: Partial<Money>) => {
      if (!changed.amount && !changed.currency) {
        onChange();
      } else {
        onChange({ ...value, ...changed });
      }
    };

    if (!value) {
      value = { amount: "0", currency: "CHF" };
    }

    return (
      <Input.Group compact className="input-money">
        <InputNumber
          className="input-money-amount"
          ref={ref as any}
          autoFocus={props.autoFocus}
          min={0}
          precision={2}
          defaultValue={parseFloat(value.amount)}
          onChange={amount =>
            amount === null || amount!.toString() === ""
              ? triggerChange({})
              : triggerChange({ amount: amount!.toString() })
          }
          formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          parser={v => v!.replace(/\$\s?|(,*)/g, "")}
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
