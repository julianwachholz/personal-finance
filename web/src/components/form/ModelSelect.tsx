import { Select } from "antd";
import { SelectProps, SelectValue } from "antd/lib/select";
import React, { useState } from "react";
import { refetchQuery, setQueryData } from "react-query";
import { ModelWithLabel, UseItems } from "../../dao/base";
import useDebounce from "../../utils/debounce";

interface ModelSelectProps<T extends ModelWithLabel>
  extends SelectProps<SelectValue> {
  useItems: UseItems<T>;
  createItem?: (value: string) => Promise<void>;
  onItemSelect?: (value: T) => void;
}

const ModelSelect = <T extends ModelWithLabel>({
  value,
  useItems,
  createItem,
  onItemSelect,
  ...props
}: ModelSelectProps<T>) => {
  const [search, setSearch] = useState();
  const debouncedSearch = useDebounce(search, 100);
  const { data, isLoading } = useItems({ search: debouncedSearch });
  const debouncedData = useDebounce(data, 200);
  const debouncedLoading = useDebounce(isLoading, 200);

  const options =
    debouncedData?.results.map(item => {
      // @TODO when setting related field works (payee -> category)
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
        <Select.Option
          key={item.pk}
          value={item.pk.toString()}
          data-item={item}
        >
          {item.label}
        </Select.Option>
      );
    }) ?? [];

  if (createItem && search && options.length < 5) {
    options.push(
      <Select.Option key="0" value="0">
        Create "{search}"
      </Select.Option>
    );
  }

  return (
    <Select
      showSearch
      optionFilterProp="children"
      loading={debouncedLoading}
      notFoundContent={debouncedLoading ? "Loading..." : undefined}
      dropdownStyle={{ minWidth: 300 }}
      value={value}
      onSearch={setSearch}
      onSelect={async (value, option) => {
        if (createItem && value === "0") {
          await createItem(search);
        } else {
          const item = debouncedData?.results.find(
            item => item.pk.toString() === value
          );
          onItemSelect?.(item!);
        }
        refetchQuery([`items/${useItems.basename}`, { search }]);
      }}
      {...props}
    >
      {options}
    </Select>
  );
};

export default ModelSelect;
