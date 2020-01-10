import {
  DownOutlined,
  LoadingOutlined,
  SearchOutlined
} from "@ant-design/icons";
import {
  Button,
  Divider,
  Dropdown,
  Input,
  Menu,
  PageHeader,
  Table
} from "antd";
import { ColumnType, SortOrder } from "antd/lib/table/interface";
import { ColumnsType, TableProps } from "antd/lib/table/Table";
import React, { ReactText, useState } from "react";
import { DndProvider } from "react-dnd";
import DndBackend from "react-dnd-html5-backend";
import { Link, useHistory, useLocation } from "react-router-dom";
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

export const getColumnSort = (
  dataIndex: string,
  state?: BaseListLocationState
): Pick<ColumnType<any>, "sorter" | "sortOrder"> => {
  let sortOrder: SortOrder = null;
  if (state?.ordering === dataIndex) {
    sortOrder = "ascend";
  }
  if (state?.ordering === `-${dataIndex}`) {
    sortOrder = "descend";
  }
  return {
    sorter: true,
    sortOrder
  };
};

export const getColumnFilter = (
  dataIndex: string,
  state?: BaseListLocationState,
  keepEqual?: boolean
): Pick<ColumnType<any>, "filteredValue"> => {
  const filteredValue = state?.filters
    ?.filter(f => f.includes(`${dataIndex}=`))
    .map(f => (keepEqual ? f : f.split("=")[1]));

  if (!filteredValue || filteredValue?.length === 0) {
    return { filteredValue: null };
  }
  return { filteredValue };
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

export interface BaseListLocationState {
  page?: number;
  ordering?: string;
  filters?: string[];
  search?: string;
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
  const [pageSize, setPageSize] = useStoredState(
    `${useItems.basename}_pagesize`,
    10
  );

  const history = useHistory<BaseListLocationState>();
  const location = useLocation<BaseListLocationState>();

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
    ...location.state,
    pageSize
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
      current={location.state?.page ?? 1}
      onChange={current => {
        history.push(location.pathname, {
          ...location.state,
          page: current
        });
      }}
      pageSize={pageSize}
      onShowSizeChange={(_, size) => {
        history.push(location.pathname, {
          ...location.state,
          page: 1
        });
        setPageSize(size);
      }}
    />
  ) : null;

  const canSort =
    isSortable &&
    location.state?.filters?.length === 0 &&
    !location.state?.ordering &&
    !location.state?.search;

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
        <Input
          className="ant-input-search ant-input-search-enter-button ant-input-search-small"
          size={tableSize}
          value={location.state?.search}
          onChange={e => {
            history.replace(location.pathname, {
              ...location.state,
              search: e.target.value
            });
          }}
          addonAfter={
            // button just for looks, search will execute instantly
            <Button type="primary" size={tableSize}>
              {isLoading ? <LoadingOutlined /> : <SearchOutlined />}
            </Button>
          }
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
            if (!Array.isArray(sorter)) {
              sorter = [sorter];
            }
            const ordering =
              (sorter[0].order &&
                `${sorter[0].order === "ascend" ? "" : "-"}${
                  sorter[0].field
                }`) ??
              undefined;
            history.push(location.pathname, {
              search: location.state?.search,
              filters: mapFilters(filters),
              ordering,
              page: 1
            });
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
