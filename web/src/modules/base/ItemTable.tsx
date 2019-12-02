import { Table } from "antd";
import React, { useState } from "react";
import { useQuery } from "react-query";

interface IFetchItemsOptions {
  page: number;
  pageSize?: number;
  ordering?: string;
  search?: string;
}
export type FetchItems = (options: IFetchItemsOptions) => Promise<any>;

interface IItemTableProps {
  itemName: string;
  fetchItems: FetchItems;
}

const ItemTable: React.FC<IItemTableProps> = ({
  itemName,
  fetchItems,
  children
}) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [ordering, setOrdering] = useState();
  const [search, setSearch] = useState();

  const { data, isLoading, error } = useQuery(
    [itemName, { page, pageSize, ordering, search }],
    fetchItems
  );
  if (error) {
    return <h1>Error</h1>;
  }
  return (
    <Table
      dataSource={data && data.results}
      loading={isLoading}
      pagination={{
        position: "both",
        current: page,
        pageSize,
        showSizeChanger: true,
        pageSizeOptions: ["10", "25", "50", "100"],
        onShowSizeChange: (current, size) => {
          setPageSize(size);
        },
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} ${itemName}`,
        total: data && data.count
      }}
      rowKey="pk"
      onChange={(pagination, filters, sorter) => {
        setPage(pagination.current || 1);
        setOrdering(
          sorter.order &&
            `${sorter.order === "ascend" ? "" : "-"}${sorter.field}`
        );
      }}
    >
      {children}
    </Table>
  );
};

export default ItemTable;
