import { DownOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Dropdown,
  Form,
  Input,
  Menu,
  PageHeader,
  Row,
  Select,
  Table
} from "antd";
import { ColumnType, TableRowSelection } from "antd/lib/table/interface";
import { TableProps } from "antd/lib/table/Table";
import { FormInstance } from "rc-field-form";
import { Rule } from "rc-field-form/lib/interface";
import React, { HTMLAttributes, useState } from "react";
import { setQueryData } from "react-query";
import { Link } from "react-router-dom";
import { Model, ModelWithLabel, UseItems } from "../../dao/base";
import { useSettings } from "../../utils/SettingsProvider";
import { mapFilters } from "./BaseList";
import "./BaseModule.scss";
import ListPagination from "./ListPagination";

type FormField =
  | React.ReactElement
  | ((form: FormInstance) => React.ReactElement);

interface EditableColumnType<T> extends ColumnType<T> {
  editable?: boolean;
  formName?: string;
  formField?: FormField;

  // Get the form value entry from an existing value, in addition to the actual value
  formValue?: (key: string, value: any) => [string, any];

  // Trigger when this form field was changed
  formChange?: (changed: Partial<T>, form: FormInstance) => void;

  rules?: Rule[];
}

export type EditableColumnsType<T> = EditableColumnType<T>[];

interface EditableCellProps<T> extends HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  name: string;
  field: FormField;
  rules?: any;
  item: T;
  children: React.ReactNode;
}

const EditableCell: React.FC<any> = <T extends Model>({
  editing,
  name,
  dataIndex,
  field,
  rules,
  item,
  title,
  children,
  ...props
}: EditableCellProps<T>) => {
  return (
    <td {...props}>
      {editing ? (
        <Form.Item
          name={name}
          rules={rules ?? [{ required: true, message: `${title} is required` }]}
        >
          {field}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

interface BulkAction {
  key: string;
  name: string;
  action: (selectedKeys: number[]) => Promise<void>;
}

interface EditableListProps<T extends ModelWithLabel> {
  itemName: string;
  itemNamePlural: string;
  useItems: UseItems<T>;
  columns?: EditableColumnsType<T>;
  getColumns?: (form: FormInstance) => EditableColumnsType<T>;
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
  onSave?: (item: T) => Promise<T>;
  // default values for a new item
  defaultValues?: Partial<T>;
  // allow actions on many items at once
  bulkActions?: BulkAction[];
}

const BaseEditableList = <T extends ModelWithLabel>({
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
  onSave,
  defaultValues = {},
  bulkActions
}: EditableListProps<T>) => {
  if (editable && !onSave) {
    throw new Error("editable list requires onSave callback");
  }
  const { tableSize } = useSettings();
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [ordering, setOrdering] = useState();
  const [filters, setFilters] = useState<string[]>([]);
  const [search, setSearch] = useState();

  const [bulkMode, setBulkMode] = useState(false);
  const [bulkAction, setBulkAction] = useState<string>();
  const [bulkLoading, setBulkLoading] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);

  // Editable table
  const [form] = Form.useForm();
  if (!columns && getColumns) {
    columns = getColumns(form);
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

    const mappedItem = Object.fromEntries([...mapped, ...extra]);
    const data = { ...defaultValues, ...mappedItem };
    form.resetFields();
    form.setFieldsValue(data);
    setEditingItem(data);
  };
  const cancelEdit = () => {
    setEditingItem(undefined);
  };

  const onValuesChange = (changedValues: any) => {
    const changedKeys = Object.keys(changedValues);
    columns!
      .filter(col => !!col.formChange)
      .forEach(col => {
        if (
          (col.dataIndex && changedKeys.includes(col.dataIndex as string)) ||
          (col.formName && changedKeys.includes(col.formName))
        ) {
          col.formChange!(changedValues, form);
        }
      });
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
    page,
    pageSize,
    ordering,
    filters,
    search
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
    } catch (e) {}
    setEditLoading(false);
  };

  // save total item count in state to prevent pagination jumping around
  if (data && data.count !== total) {
    setTotal(data.count);
  }

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
      current={page}
      onChange={current => {
        setPage(current);
        cancelEdit();
      }}
      pageSize={pageSize}
      onShowSizeChange={(_, size) => {
        setPage(1);
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
      ...actions,
      <Button
        key="bulk-mode"
        onClick={() => {
          setBulkMode(!bulkMode);
        }}
      >
        {bulkMode ? "Deactivate Bulk Mode" : "Bulk Mode"}
      </Button>
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
      <Row>
        <Col span={12}>
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
            <Input.Search
              size={tableSize}
              loading={isLoading}
              enterButton
              onSearch={value => {
                setSearch(value);
                cancelEdit();
                onSearch(value);
              }}
            />
          ) : null}
        </Col>
        <Col span={12}>{pager}</Col>
      </Row>
      <Form
        form={form}
        component={editable ? undefined : false}
        onValuesChange={onValuesChange}
        onFinish={values => saveItem(values as Partial<T>)}
        onKeyDown={(e: any) => {
          if (e.keyCode === 13) {
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
            setFilters(mapFilters(filters));
            if (!Array.isArray(sorter)) {
              sorter = [sorter];
            }
            setOrdering(
              sorter[0].order &&
                `${sorter[0].order === "ascend" ? "" : "-"}${sorter[0].field}`
            );
            setPage(1);
            cancelEdit();
          }}
          size={tableSize}
          {...tableProps}
        />
      </Form>
    </div>
  );
};

export default BaseEditableList;
