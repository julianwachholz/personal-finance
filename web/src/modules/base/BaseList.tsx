import { DownOutlined } from "@ant-design/icons";
import {
  Button,
  Dropdown,
  Input,
  Menu,
  PageHeader,
  Pagination,
  Table
} from "antd";
import { ColumnsType, TableProps } from "antd/lib/table/Table";
import React, { ReactText, useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { FetchItems, Model } from "../../dao/base";
import { useSettings } from "../../utils/SettingsProvider";
import "./BaseModule.scss";

const mapFilters = (filters: Record<string, ReactText[] | null>) => {
  const filterValues: string[] = [];
  Object.keys(filters).forEach(k => {
    const values = filters[k];
    if (!values) {
      return;
    }
    values.forEach(v => {
      v = v.toString();
      if (v.includes("=")) {
        filterValues.push(v);
      } else {
        filterValues.push(`${k}=${v}`);
      }
    });
  });
  return filterValues;
};

interface ListProps<T extends Model> {
  itemName: string;
  itemNamePlural: string;
  fetchItems: FetchItems<T>;
  columns: ColumnsType<T>;
  pagination?: boolean;
  showSearch?: boolean;
  onSearch?: (search?: string) => void;
  actions?: React.ReactElement[];
  extraActions?: boolean | React.ReactElement[];
  tableProps?: TableProps<T>;
}

const BaseList = <T extends Model>({
  itemName,
  itemNamePlural,
  fetchItems,
  columns,
  pagination = true,
  showSearch = true,
  onSearch = () => {},
  actions = [],
  extraActions = true,
  tableProps = {}
}: ListProps<T>) => {
  const { tableSize } = useSettings();
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [ordering, setOrdering] = useState();
  const [filters, setFilters] = useState<string[]>([]);
  const [search, setSearch] = useState();

  const { data, isLoading, error } = useQuery(
    [
      `items/${itemNamePlural.toLowerCase()}`,
      { page, pageSize, ordering, filters, search }
    ],
    fetchItems
  );

  // save total item count in state to prevent pagination jumping around
  if (data && data.count !== total) {
    setTotal(data.count);
  }

  if (error) {
    return <h1>{error.toString()}</h1>;
  }

  const extraActionMenu =
    extraActions === false ? null : extraActions === true ? (
      <Menu>
        <Menu.Item>
          <Link to="#">Import</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="#">Export</Link>
        </Menu.Item>
      </Menu>
    ) : (
      <Menu>
        {extraActions.map((action, i) => (
          <Menu.Item key={i}>{action}</Menu.Item>
        ))}
      </Menu>
    );

  const pager = pagination ? (
    <Pagination
      total={total}
      showLessItems
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
        total === 1
          ? `1 ${itemName}`
          : `${range[0]}-${range[1]} of ${total} ${itemNamePlural}`
      }
    />
  ) : null;

  return (
    <div className="module module-list">
      <PageHeader
        title={itemNamePlural}
        extra={[
          extraActionMenu ? (
            <Dropdown key="more" overlay={extraActionMenu}>
              <Button icon={<DownOutlined />}>Actions</Button>
            </Dropdown>
          ) : null,
          ...actions
        ]}
      />
      {showSearch ? (
        <Input.Search
          loading={isLoading}
          enterButton
          onSearch={value => {
            setSearch(value);
            onSearch(value);
          }}
        />
      ) : null}
      {pager}
      <Table<T>
        dataSource={data?.results ?? []}
        columns={columns}
        loading={isLoading}
        rowKey="pk"
        pagination={false}
        onChange={(_pagination, filters, sorter) => {
          setFilters(mapFilters(filters));
          if (!Array.isArray(sorter)) {
            sorter = [sorter];
          }
          setOrdering(
            sorter[0].order &&
              `${sorter[0].order === "ascend" ? "" : "-"}${sorter[0].field}`
          );
        }}
        size={tableSize}
        {...tableProps}
      />
    </div>
  );
};

export default BaseList;
