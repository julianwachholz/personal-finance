import { Select } from "antd";
import { SelectProps, SelectValue } from "antd/lib/select";
import React from "react";
import { ModelWithLabel, UseItems } from "../../dao/base";
import { SizedSelect } from "./SizedInput";

interface ModelSelectProps<T extends ModelWithLabel>
  extends SelectProps<SelectValue> {
  useItems: UseItems<T>;
}

const ModelSelect = <T extends ModelWithLabel>({
  useItems,
  ...props
}: ModelSelectProps<T>) => {
  const { data, isLoading } = useItems();
  const options = data?.results.map(item => (
    <Select.Option key={item.pk} value={item.pk}>
      {item.label}
    </Select.Option>
  ));
  return (
    <SizedSelect {...props} loading={isLoading}>
      {options}
    </SizedSelect>
  );
};

export default ModelSelect;
