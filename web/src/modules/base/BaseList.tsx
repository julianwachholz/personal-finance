import { DownOutlined } from "@ant-design/icons";
import {
  Button,
  Divider,
  Dropdown,
  Input,
  Menu,
  PageHeader,
  Table
} from "antd";
import { ColumnsType, TableProps } from "antd/lib/table/Table";
import React, { ReactText, useState } from "react";
import { DndProvider } from "react-dnd";
import DndBackend from "react-dnd-html5-backend";
import { Link } from "react-router-dom";
import { ModelWithLabel, UseItems } from "../../dao/base";
import { useSettings } from "../../utils/SettingsProvider";
import useStoredState from "../../utils/useStoredState";
import useTitle from "../../utils/useTitle";
import "./BaseModule.scss";
import ListPagination from "./ListPagination";
import { DndRow } from "./SortableTable";

export const mapFilters = (filters: Record<string, ReactText[] | null>) => {
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

interface ListProps<T extends ModelWithLabel> {
  itemName: string;
  itemNamePlural: string;
  useItems: UseItems<T>;
  columns: ColumnsType<T>;
  pagination?: boolean;
  showSearch?: boolean;
  onSearch?: (search?: string) => void;
  actions?: React.ReactElement[];
  extraActions?: boolean | React.ReactElement[];
  extraRowActions?: (record: T, index: number) => React.ReactElement[];
  tableProps?: TableProps<T>;
  isSortable?: boolean;
  onMove?: (pk: number, pos: number) => void;
}

const BaseList = <T extends ModelWithLabel>({
  itemName,
  itemNamePlural,
  useItems,
  columns,
  pagination = true,
  showSearch = true,
  onSearch = () => {},
  actions = [],
  extraActions = true,
  extraRowActions,
  tableProps = {},
  isSortable,
  onMove
}: ListProps<T>) => {
  const { tableSize } = useSettings();
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useStoredState(
    `${useItems.basename}_pagesize`,
    10
  );
  const [ordering, setOrdering] = useState();
  const [filters, setFilters] = useState<string[]>([]);
  const [search, setSearch] = useState();

  if (isSortable && !onMove) {
    throw new Error("onMove is required with isSortable");
  }

  if (extraRowActions) {
    columns = [
      ...columns,
      {
        align: "right",
        render(_, item, i) {
          return (
            <>
              {extraRowActions &&
                extraRowActions(item, i).map(action => [
                  <Divider key={`div-${i}`} type="vertical" />,
                  action
                ])}
            </>
          );
        }
      }
    ];
  }

  const useItemOptions = {
    page,
    pageSize,
    ordering,
    filters,
    search
  };
  const { data, isLoading, error } = useItems(useItemOptions);

  // save total item count in state to prevent pagination jumping around
  if (data && data.count !== total) {
    setTotal(data.count);
  }

  useTitle(itemNamePlural);

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
    <ListPagination
      itemName={itemName}
      itemNamePlural={itemNamePlural}
      total={total}
      current={page}
      onChange={current => {
        setPage(current);
      }}
      pageSize={pageSize}
      onShowSizeChange={(_, size) => {
        setPage(1);
        setPageSize(size);
      }}
    />
  ) : null;

  const canSort = isSortable && filters.length === 0 && !ordering && !search;

  const components = canSort
    ? ({
        body: {
          row: DndRow
        }
      } as any)
    : undefined;

  let dataSource: T[] = data?.results ?? [];

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
          size={tableSize}
          loading={isLoading}
          enterButton
          onSearch={value => {
            setSearch(value);
            onSearch(value);
          }}
        />
      ) : null}
      {pager}
      <DndProvider backend={DndBackend}>
        <Table<T>
          dataSource={dataSource}
          columns={columns}
          loading={isLoading}
          rowKey="pk"
          pagination={false}
          tableLayout="fixed"
          onChange={(_pagination, filters, sorter) => {
            setFilters(mapFilters(filters));
            if (!Array.isArray(sorter)) {
              sorter = [sorter];
            }
            setOrdering(
              sorter[0].order &&
                `${sorter[0].order === "ascend" ? "" : "-"}${sorter[0].field}`
            );
            setPage(1);
          }}
          size={tableSize}
          components={components}
          onRow={(record, index) => {
            if (canSort) {
              return {
                index,
                pk: record.pk,
                onDrop(item: any) {
                  if (record.pk === item.pk) {
                    // noop
                    return;
                  }
                  onMove!(item.pk, index!);
                }
              } as any;
            }
          }}
          {...tableProps}
        />
      </DndProvider>
    </div>
  );
};

export default BaseList;
