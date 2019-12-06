import { Input, InputNumber, Select } from "antd";
import React from "react";
import { IMoney } from "../data/Money";

interface IMoneyInputProps {
  value?: IMoney;
  onChange?: (value?: Partial<IMoney>) => void;
  autoFocus?: boolean;
}

const MoneyInput: React.FC<IMoneyInputProps> = React.forwardRef(
  ({ value = {}, onChange = () => {}, ...props }, ref) => {
    const triggerChange = (changed: Partial<IMoney>) => {
      if (!changed.amount) {
        onChange();
      } else {
        onChange({ ...value, ...changed });
      }
    };

    return (
      <Input.Group compact>
        <InputNumber
          ref={ref as any}
          autoFocus={props.autoFocus}
          min={0}
          precision={2}
          defaultValue={parseFloat((value && value.amount) || "0")}
          onChange={amount => {
            console.log("onChange", amount);
            return amount === null || amount!.toString() === ""
              ? triggerChange({})
              : triggerChange({ amount: amount!.toString() });
          }}
          formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          parser={v => v!.replace(/\$\s?|(,*)/g, "")}
        />
        <Select
          showSearch
          defaultValue={value.currency}
          onChange={(currency: string) => triggerChange({ currency })}
        >
          <Select.Option value="USD">USD</Select.Option>
          <Select.Option value="EUR">EUR</Select.Option>
          <Select.Option value="CHF">CHF</Select.Option>
          <Select.Option value="JPY">JPY</Select.Option>
          <Select.Option value="PLN">PLN</Select.Option>
        </Select>
      </Input.Group>
    );
  }
);

export default MoneyInput;
