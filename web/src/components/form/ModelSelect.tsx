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
    if (Array.isArray(value)) {
      value = (value as string[]).map(v => v.toString());
    } else {
      value = value?.toString();
    }
    return (
      <Select.Option key={item.pk} value={item.pk.toString()} data-item={item}>
        {item.label}
      </Select.Option>
    );
  });

  return (
    <Select
      showSearch
      optionFilterProp="children"
      loading={isLoading}
      dropdownStyle={{ minWidth: 300 }}
      value={value}
      {...props}
    >
      {options}
    </Select>
  );
};

export default ModelSelect;
