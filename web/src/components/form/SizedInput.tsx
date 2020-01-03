import { PickerProps } from "antd/lib/date-picker/generatePicker";
import Input, { InputProps } from "antd/lib/input";
import InputNumber, { InputNumberProps } from "antd/lib/input-number";
import Select, { SelectProps, SelectValue } from "antd/lib/select";
import React from "react";
import { useSettings } from "../../utils/SettingsProvider";
import DatePicker from "./DatePicker";

export const SizedInput = (props: InputProps) => {
  const { tableSize } = useSettings();
  const size = tableSize === "small" ? "small" : "default";
  return <Input {...props} size={size} />;
};

export const SizedInputNumber = ({ size, ...props }: InputNumberProps) => {
  const { tableSize } = useSettings();
  size = size ?? (tableSize === "small" ? "small" : "default");
  return <InputNumber {...props} size={size} />;
};

export const SizedSelect = <VT extends SelectValue = SelectValue>({
  size,
  ...props
}: SelectProps<VT>) => {
  const { tableSize } = useSettings();
  size = size ?? (tableSize === "small" ? "small" : "default");
  return <Select<VT> {...props} size={size} />;
};

export const SizedDatePicker = ({ size, ...props }: PickerProps<Date>) => {
  const { tableSize } = useSettings();
  size = size ?? (tableSize === "small" ? "small" : "default");
  return <DatePicker {...props} size={size} />;
};
