import {
  Button,
  Icon,
  Input,
  Table,
  PageHeader,
  Pagination,
  Menu,
  Dropdown,
  Row,
  Col
} from "antd";
import { FilterDropdownProps } from "antd/lib/table";
import React, { ReactText, useState } from "react";
import { useQuery } from "react-query";
import { FetchItems, IModel } from "../../dao/base";
import "./BaseList.scss";
import { Link } from "react-router-dom";

export const getColumnSearchProps = (onChange?: (value: string) => void) => {
  let searchInput: Input | null;

  const handleSearch = (selectedKeys: ReactText[] | string[], confirm: any) => {
    confirm();
    onChange && onChange(selectedKeys[0] as string);
  };
  const handleReset = (clearFilters: (selectedKeys: string[]) => void) => {
    clearFilters([]);
    onChange && onChange("");
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
          placeholder={`Search`}
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

const mapFilters = (filters: Record<string | number | symbol, string[]>) => {
  const filterValues: string[] = [];
  Object.keys(filters).forEach(k => {
    filters[k].forEach(v => {
      if (v.includes("=")) {
        filterValues.push(v);
      } else {
        filterValues.push(`${k}=${v}`);
      }
    });
  });
  return filterValues;
};

interface IItemTableProps<T extends IModel> {
  itemName: string;
  fetchItems: FetchItems<T>;
  pagination?: boolean;
  showSearch?: boolean;
}

const ItemTable: React.FC<IItemTableProps<any>> = ({
  itemName,
  fetchItems,
  pagination = true,
  showSearch = true,
  children
}) => {
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [ordering, setOrdering] = useState();
  const [filters, setFilters] = useState<string[]>([]);
  const [search, setSearch] = useState();

  const { data, isLoading, error } = useQuery(
    [itemName, { page, pageSize, ordering, filters, search }],
    fetchItems
  );

  // save total item count in state to prevent pagination jumping around
  if (data && data.count !== total) {
    setTotal(data.count);
  }

  if (error) {
    return <h1>Error</h1>;
  }

  const actions = (
    <Menu>
      <Menu.Item>
        <Link to="#">Import</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to="#">Export</Link>
      </Menu.Item>
    </Menu>
  );

  const pager = pagination ? (
    <Pagination
      total={total}
      current={page}
      onChange={current => {
        setPage(current);
      }}
      pageSize={pageSize}
      showSizeChanger
      pageSizeOptions={["10", "25", "50", "100"]}
      onShowSizeChange={(current, size) => {
        const currentFirstIndex = (current - 1) * pageSize + 1;
        setPage(Math.ceil(currentFirstIndex / size));
        setPageSize(size);
      }}
      showTotal={(total, range) =>
        `${range[0]}-${range[1]} of ${total} ${itemName}`
      }
    />
  ) : null;

  return (
    <div className="module module-list">
      <PageHeader
        title={itemName}
        extra={[
          <Dropdown key="more" overlay={actions}>
            <Button icon="down">Actions</Button>
          </Dropdown>,
          <Button key="create" type="primary">
            Create {itemName}
          </Button>
        ]}
      />
      {showSearch ? (
        <Input.Search
          loading={isLoading}
          enterButton
          onSearch={value => {
            setSearch(value);
          }}
        />
      ) : null}
      {pager}
      <Table
        dataSource={(data && data.results) || []}
        loading={isLoading}
        rowKey="pk"
        pagination={false}
        onChange={(pagination, filters, sorter) => {
          setPage(pagination.current || 1);
          setFilters(mapFilters(filters));
          setOrdering(
            sorter.order &&
              `${sorter.order === "ascend" ? "" : "-"}${sorter.field}`
          );
        }}
      >
        {children}
      </Table>
    </div>
  );
};

export default ItemTable;
