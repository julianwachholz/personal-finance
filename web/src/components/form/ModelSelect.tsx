import { Select } from "antd";
import { SelectProps, SelectValue } from "antd/lib/select";
import React from "react";
import { setQueryData } from "react-query";
import { ModelWithLabel, UseItems } from "../../dao/base";

interface ModelSelectProps<T extends ModelWithLabel>
  extends SelectProps<SelectValue> {
  useItems: UseItems<T>;
}

const ModelSelect = <T extends ModelWithLabel>({
  value,
  mode,
  useItems,
  ...props
}: ModelSelectProps<T>) => {
  const { data, isLoading } = useItems();
  const options = data?.results.map(item => {
    if (value === item.pk) {
      setQueryData([`item/${useItems.basename}`, { pk: item.pk }], item, {
        shouldRefetch: false
      });
    }
    return (
      <Select.Option key={item.pk} value={item.pk}>
        {item.label}
      </Select.Option>
    );
  });

  return (
    <Select
      showSearch
      loading={isLoading}
      dropdownStyle={{ minWidth: 300 }}
      value={value}
      mode={mode}
      {...props}
    >
      {options}
    </Select>
  );
};

export default ModelSelect;
