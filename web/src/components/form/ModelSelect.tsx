import { Select } from "antd";
import { SelectProps, SelectValue } from "antd/lib/select";
import { LabeledValue } from "antd/lib/tree-select";
import React, { useState } from "react";
import { ModelWithLabel, UseItems } from "../../dao/base";
import useDebounce from "../../utils/debounce";

interface ModelSelectProps<T extends ModelWithLabel>
  extends SelectProps<SelectValue> {
  value?: LabeledValue | LabeledValue[];
  useItems: UseItems<T>;

  // Simple item creation by a single string
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
  const [isCreating, setCreating] = useState(false);

  const options =
    debouncedData?.results.map(item => (
      <Select.Option key={item.pk.toString()} value={item.pk}>
        {item.label}
      </Select.Option>
    )) ?? [];

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
      labelInValue
      optionFilterProp="children"
      loading={isCreating || debouncedLoading}
      notFoundContent={debouncedLoading ? "Loading..." : undefined}
      dropdownStyle={{ minWidth: 300 }}
      value={value}
      onSearch={setSearch}
      onSelect={async value => {
        if (typeof value !== "object") {
          return;
        }
        if (createItem && value.value === "0") {
          setCreating(true);
          await createItem(search);
          setCreating(false);
          setSearch(undefined);
        } else {
          const item = debouncedData?.results.find(
            item => item.pk === value.value
          );
          onItemSelect?.(item!);
        }
      }}
      {...props}
    >
      {options}
    </Select>
  );
};

export default ModelSelect;
