import {
  DownOutlined,
  LoadingOutlined,
  SearchOutlined
} from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Dropdown,
  Form,
  Input,
  Menu,
  Row,
  Select,
  Table
} from "antd";
import { ButtonProps } from "antd/lib/button";
import { TableRowSelection } from "antd/lib/table/interface";
import { TableProps } from "antd/lib/table/Table";
import { Location } from "history";
import { FormInstance } from "rc-field-form";
import React, { useState } from "react";
import { setQueryData } from "react-query";
import { Link, useHistory, useLocation } from "react-router-dom";
import AppHeader from "../../components/layout/AppHeader";
import { ModelWithLabel, UseItems } from "../../dao/base";
import { useSettings } from "../../utils/SettingsProvider";
import useStoredState from "../../utils/useStoredState";
import useTitle from "../../utils/useTitle";
import "./BaseModule.scss";
import { BaseTableLocationState, mapFilters } from "./BaseTable";
import { EditableCell, EditableColumnsType } from "./EditableTable";
import ListPagination from "./ListPagination";

interface InlineCreateButton {
  key: string;
  label: string;
  buttonProps?: ButtonProps;
  defaultValues: any;
}

type DefaultValues<T extends ModelWithLabel> = {
  [K in keyof T]?: T[K] | (() => T[K]);
};

interface BulkAction {
  key: string;
  name: string;
  action: (selectedKeys: number[]) => Promise<void>;
}

const getDefaultValues = <T extends ModelWithLabel>(
  v: DefaultValues<T>
): Partial<T> => {
  return Object.fromEntries(
    Object.entries(v).map(([key, value]) => {
      if (typeof value === "function") {
        return [key, value()];
      }
      return [key, value];
    })
  );
};

const applyError = <T extends ModelWithLabel>(
  form: FormInstance,
  columns: EditableColumnsType<T>,
  error: any
) => {
  if (error.non_field_errors) {
    form.setFields([
      {
        name: columns![0].dataIndex as string,
        errors: error.non_field_errors
      }
    ]);
  } else {
    console.error(`save item failed`, error);
  }
};

interface EditableTableProps<T extends ModelWithLabel> {
  itemName: string;
  itemNamePlural: string;
  useItems: UseItems<T>;
  columns?: EditableColumnsType<T>;
  getColumns?: (
    location: Location<BaseTableLocationState>,
    form: FormInstance
  ) => EditableColumnsType<T>;
  pagination?: boolean;
  showSearch?: boolean;
  onSearch?: (search?: string) => void;
  actions?: React.ReactElement[];
  extraActions?: boolean | React.ReactElement[];
  extraRowActions?: (record: T, index: number) => React.ReactElement[];
  tableProps?: TableProps<T>;

  // can records be edited inline?
  editable?: boolean;
  isEditable?: (record: T) => boolean;
  inlineCreateButtons?: InlineCreateButton[];
  onSave?: (item: T) => Promise<T>;
  // default values for a new item
  defaultValues?: DefaultValues<T>;
  // allow actions on many items at once
  bulkActions?: BulkAction[];

  children?: React.ReactNode;
}

const BaseEditableTable = <T extends ModelWithLabel>({
  itemName,
  itemNamePlural,
  useItems,
  columns,
  getColumns,
  pagination = true,
  showSearch = true,
  onSearch = () => {},
  actions = [],
  extraActions = true,
  extraRowActions,
  tableProps = {},
  editable = false,
  isEditable = () => true,
  inlineCreateButtons,
  onSave,
  defaultValues = {},
  bulkActions,
  children
}: EditableTableProps<T>) => {
  if (editable && !onSave) {
    throw new Error("editable list requires onSave callback");
  }
  const { tableSize } = useSettings();
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useStoredState(
    `${useItems.basename}_pagesize`,
    10
  );

  const history = useHistory<BaseTableLocationState>();
  const location = useLocation<BaseTableLocationState>();

  const [bulkMode, setBulkMode] = useState(false);
  const [bulkAction, setBulkAction] = useState<string>();
  const [bulkLoading, setBulkLoading] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);

  // Editable table
  const [form] = Form.useForm();
  if (!columns && getColumns) {
    columns = getColumns(location, form);
  }
  if (!columns) {
    throw new Error("BaseList must specify columns or getColumns");
  }

  const [editingItem, setEditingItem] = useState<T>();
  const [editLoading, setEditLoading] = useState(false);
  const isEditing = (item: T) => item.pk === editingItem?.pk;
  const editItem = (item: T) => {
    const extra: any[][] = [];
    const mapped = Object.entries(item).map(([key, value]) => {
      const col = columns!.find(c => c.formName === key || c.dataIndex === key);
      if (col?.formValue) {
        extra.push(col.formValue(key, value));
      }
      return [key, value];
    });

    const mappedItem = Object.fromEntries([
      ...mapped,
      ...extra.filter(([k, v]) => !!v)
    ]);
    const data = { ...getDefaultValues(defaultValues), ...mappedItem };
    form.resetFields();
    form.setFieldsValue(data);
    setEditingItem(data);
  };
  const cancelEdit = () => {
    setEditingItem(undefined);
  };

  if (!bulkMode && (editable || extraRowActions)) {
    columns = [
      ...columns.map(col => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: (item: T) => {
            return {
              item,
              title: col.title,
              dataIndex: col.dataIndex,
              name: col.formName ?? col.dataIndex,
              field: col.formField ?? <Input />,
              rules: col.rules,
              editing: isEditing(item)
            } as any;
          }
        };
      }),
      {
        align: "right",
        width: tableSize === "small" ? 136 : 165,
        render(_, item, i) {
          const canEdit = editable && isEditable(item);
          return isEditing(item) ? (
            <>
              <Button
                type="primary"
                size={tableSize === "small" ? "small" : "middle"}
                htmlType="submit"
                loading={editLoading}
              >
                Save
              </Button>
              <Button type="link" onClick={() => cancelEdit()}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              {canEdit && (
                <Button type="link" onClick={() => editItem(item)}>
                  Edit
                </Button>
              )}
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

  const components = { body: { cell: EditableCell } };

  const useItemOptions = {
    ...location.state,
    pageSize
  };
  const { data, isLoading, error } = useItems(useItemOptions);

  // Save inline editing item
  const saveItem = async (values: Partial<T>) => {
    if (!data) {
      return;
    }
    setEditLoading(true);
    await form.validateFields();
    const newValues = {
      ...editingItem!,
      ...values
    };
    try {
      const savedItem = await onSave!(newValues);

      // force update current view
      const i = data.results.findIndex(item => item.pk === savedItem.pk);
      const newData = { ...data };
      newData.results[i] = savedItem;
      await setQueryData(
        [`items/${itemNamePlural.toLowerCase()}`, useItemOptions],
        newData
      );
      cancelEdit();
    } catch (error) {
      applyError<T>(form, columns!, error);
    }
    setEditLoading(false);
  };

  // save total item count in state to prevent pagination jumping around
  if (data && data.count !== total) {
    setTotal(data.count);
  }

  useTitle(itemNamePlural);

  if (error) {
    return <h1>{error.toString()}</h1>;
  }

  const extraActionMenu =
    extraActions === false || bulkMode ? null : extraActions === true ? (
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
        history.push(location.pathname, { ...location.state, page: current });
        cancelEdit();
      }}
      pageSize={pageSize}
      onShowSizeChange={(_, size) => {
        history.push(location.pathname, { ...location.state, page: 1 });
        setPageSize(size);
        cancelEdit();
      }}
    />
  ) : null;

  let dataSource: T[];
  if (editingItem?.pk === 0) {
    dataSource = [{ pk: 0 } as any, ...(data?.results ?? [])];
  } else {
    dataSource = data?.results ?? [];
  }

  if (bulkActions) {
    actions = [
      <Button
        key="bulk-mode"
        onClick={() => {
          setBulkMode(!bulkMode);
        }}
      >
        {bulkMode ? "Deactivate Bulk Mode" : "Bulk Mode"}
      </Button>,
      ...(bulkMode ? [] : actions)
    ];
  }

  const rowSelection: TableRowSelection<T> | undefined = bulkMode
    ? {
        type: "checkbox",
        selectedRowKeys: selectedKeys,
        onChange: selectedRowKeys => {
          setSelectedKeys(selectedRowKeys as number[]);
        }
      }
    : undefined;

  if (editable && !bulkMode) {
    if (inlineCreateButtons) {
      actions = [
        ...actions,
        ...inlineCreateButtons.map(b => (
          <Button
            key={b.key}
            onClick={() => {
              editItem({ pk: 0, ...b.defaultValues });
            }}
            {...b.buttonProps}
          >
            {b.label}
          </Button>
        ))
      ];
    } else {
      actions = [
        ...actions,
        <Button
          key="inline-create"
          type="primary"
          onClick={() => {
            editItem({ pk: 0 } as any);
          }}
        >
          Create {itemName}
        </Button>
      ];
    }
  }

  return (
    <div className="module module-list">
      <AppHeader
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
      <Row>
        <Col span={10}>
          {bulkMode ? (
            <>
              <Select
                size={tableSize}
                placeholder="Select bulk action..."
                style={{ width: 200 }}
                value={bulkAction}
                onChange={(v: string) => setBulkAction(v)}
              >
                {(bulkActions! as BulkAction[]).map(b => (
                  <Select.Option key={b.key} value={b.key}>
                    {b.name}
                  </Select.Option>
                ))}
              </Select>{" "}
              <Button
                size={tableSize}
                disabled={!bulkAction || selectedKeys.length === 0}
                loading={bulkLoading}
                type="primary"
                onClick={async () => {
                  const bulk = bulkActions!.find(b => b.key === bulkAction);
                  setBulkLoading(true);
                  await bulk!.action(selectedKeys);
                  setBulkLoading(false);
                  setSelectedKeys([]);
                }}
              >
                Go
              </Button>
              {selectedKeys.length} of {total} selected
            </>
          ) : showSearch ? (
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
        </Col>
        <Col span={14}>{pager}</Col>
      </Row>
      <Form
        form={form}
        component={editable ? undefined : false}
        onFinish={values => saveItem(values as Partial<T>)}
        onKeyDown={(e: any) => {
          if (e.keyCode === 13) {
            if (editLoading) {
              e.preventDefault();
            }
            if (
              e.target.tagName.toLowerCase() === "button" ||
              e.target.classList.contains("ant-input") ||
              e.target.classList.contains("ant-input-number-input")
            ) {
              return;
            }
            e.preventDefault();
          }
        }}
        onKeyUp={e => {
          // ESC
          if (e.keyCode === 27) {
            cancelEdit();
          }
        }}
        size={tableSize === "small" ? "small" : "middle"}
      >
        <Table<T>
          dataSource={dataSource}
          components={components}
          columns={columns}
          loading={isLoading}
          rowKey="pk"
          pagination={false}
          tableLayout="fixed"
          rowSelection={rowSelection}
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
            cancelEdit();
          }}
          size={tableSize}
          {...tableProps}
        />
      </Form>
      {children}
    </div>
  );
};

export default BaseEditableTable;
