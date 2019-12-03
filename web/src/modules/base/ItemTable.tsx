import { Button, Icon, Input, Table } from "antd";
import { FilterDropdownProps } from "antd/lib/table";
import React, { ReactText, useState } from "react";
import { useQuery } from "react-query";
import { FetchItems } from "../../dao/base";

const getColumnSearchProps = (
  dataIndex: string,
  setValue: (value: string) => void
) => {
  let searchInput: Input | null;

  const handleSearch = (selectedKeys: ReactText[] | string[], confirm: any) => {
    confirm();
    setValue(selectedKeys[0] as string);
  };
  const handleReset = (clearFilters: (selectedKeys: string[]) => void) => {
    clearFilters([]);
    setValue("");
  };

  return {
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }: Required<FilterDropdownProps>) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => (searchInput = node)}
          placeholder={`Search accounts`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          onClick={() => handleSearch(selectedKeys, confirm)}
          icon="search"
          type="primary"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilterDropdownVisibleChange: (visible: boolean) => {
      if (visible) {
        setTimeout(() => searchInput!.select());
      }
    }
  };
};

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
