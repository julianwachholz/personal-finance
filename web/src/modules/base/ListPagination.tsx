import { Pagination } from "antd";
import React from "react";
import { useSettings } from "../../utils/SettingsProvider";

interface ListPaginationProps {
  total: number;
  current: number;
  pageSize: number;
  itemName: string;
  itemNamePlural?: string;

  onChange: (current: number, pageSize?: number) => void;
  onShowSizeChange: (current: number, pageSize: number) => void;
}

const ListPagination = ({
  total,
  current,
  pageSize,
  itemName,
  itemNamePlural,
  onChange,
  onShowSizeChange
}: ListPaginationProps) => {
  const { tableSize } = useSettings();
  if (!itemNamePlural) {
    itemNamePlural = `${itemName}s`;
  }
  return (
    <Pagination
      total={total}
      showLessItems
      current={current}
      onChange={onChange}
      size={tableSize}
      pageSize={pageSize}
      showSizeChanger
      pageSizeOptions={["10", "25", "50", "100"]}
      onShowSizeChange={onShowSizeChange}
      showTotal={(total, range) =>
        total === 1
          ? `1 ${itemName}`
          : `${range[0]}-${range[1]} of ${total} ${itemNamePlural}`
      }
    />
  );
};

export default ListPagination;
