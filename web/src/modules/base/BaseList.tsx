import { DownOutlined } from "@ant-design/icons";
import {
  Button,
  Divider,
  Dropdown,
  Form,
  Input,
  Menu,
  PageHeader,
  Pagination,
  Table
} from "antd";
import { ColumnType } from "antd/lib/table/interface";
import { TableProps } from "antd/lib/table/Table";
import { FormInstance } from "rc-field-form";
import { Rule } from "rc-field-form/lib/interface";
import React, { HTMLAttributes, ReactText, useState } from "react";
import { setQueryData } from "react-query";
import { Link } from "react-router-dom";
import { Model, ModelWithLabel, UseItems } from "../../dao/base";
import { useSettings } from "../../utils/SettingsProvider";
import "./BaseModule.scss";

type FormField =
  | React.ReactElement
  | ((form: FormInstance) => React.ReactElement);

interface EditableColumnType<T> extends ColumnType<T> {
  editable?: boolean;
  formName?: string;
  formField?: FormField;

  // Get the form value entry from an existing value
  formValue?: (key: string, value: any) => [string, any];

  rules?: Rule[];
}

export type EditableColumnsType<T> = EditableColumnType<T>[];

interface EditableCellProps<T> extends HTMLAttributes<HTMLElement> {
  editing: boolean;
  name: string;
  field: FormField;
  rules?: any;
  item: T;
  children: React.ReactNode;
}

const EditableCell: React.FC<any> = <T extends Model>({
  editing,
  name,
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

interface ListProps<T extends ModelWithLabel> {
  itemName: string;
  itemNamePlural: string;
  useItems: UseItems<T>;
  columns: EditableColumnsType<T>;
  pagination?: boolean;
  showSearch?: boolean;
  onSearch?: (search?: string) => void;
  actions?: React.ReactElement[];
  extraActions?: boolean | React.ReactElement[];
  extraRowActions?: (record: T, index: number) => React.ReactElement[];
  tableProps?: TableProps<T>;
  editable?: boolean;
  isEditable?: (record: T) => boolean;
  onSave?: (item: T) => Promise<T>;
  defaultValues?: Partial<T>;
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
  editable = false,
  isEditable = () => true,
  onSave,
  defaultValues = {}
}: ListProps<T>) => {
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

  // Editable table
  const [form] = Form.useForm();
  // const [inlineCreate, setInlineCreate] = useState(false);
  const [editingItem, setEditingItem] = useState<T>();
  const [editLoading, setEditLoading] = useState(false);
  const isEditing = (item: T) => item.pk === editingItem?.pk;
  const editItem = (item: T) => {
    const mappedItem = Object.fromEntries(
      Object.entries(item).map(([key, value]) => {
        const col = columns.find(
          c => c.formName === key || c.dataIndex === key
        );
        if (col?.formValue) {
          return col.formValue(key, value);
        }
        return [key, value];
      })
    );
    const data = { ...defaultValues, ...mappedItem };
    form.resetFields();
    form.setFieldsValue(data);
    setEditingItem(data);
  };
  const cancelEdit = () => {
    setEditingItem(undefined);
  };

  if (editable || extraRowActions) {
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
              name: col.formName ?? col.dataIndex,
              field: col.formField ?? (
                <Input size={tableSize === "small" ? "small" : "default"} />
              ),
              rules: col.rules,
              editing: isEditing(item)
            } as any;
          }
        };
      }),
      {
        align: "right",
        width: 200,
        render(_, item, i) {
          const canEdit = editable && isEditable(item);
          return isEditing(item) ? (
            <>
              <Button
                type="primary"
                size={tableSize === "small" ? "small" : "default"}
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
        cancelEdit();
      }}
      pageSize={pageSize}
      showSizeChanger
      pageSizeOptions={["10", "25", "50", "100"]}
      onShowSizeChange={(_, size) => {
        setPage(1);
        setPageSize(size);
        cancelEdit();
      }}
      showTotal={(total, range) =>
        total === 1
          ? `1 ${itemName}`
          : `${range[0]}-${range[1]} of ${total} ${itemNamePlural}`
      }
    />
  ) : null;

  let dataSource: T[];
  if (editingItem?.pk === 0) {
    dataSource = [{ pk: 0 } as any, ...(data?.results ?? [])];
  } else {
    dataSource = data?.results ?? [];
  }

  if (editable) {
    actions = [
      ...actions,
      <Button
        key="inline-create"
        type="primary"
        onClick={() => {
          editItem({ pk: 0 } as any);
        }}
      >
        Quick Create {itemName}
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
      {showSearch ? (
        <Input.Search
          loading={isLoading}
          enterButton
          onSearch={value => {
            setSearch(value);
            cancelEdit();
            onSearch(value);
          }}
        />
      ) : null}
      {pager}
      <Form
        form={form}
        component={editable ? undefined : false}
        onFinish={values => saveItem(values as Partial<T>)}
        onKeyUp={e => {
          // ESC
          if (e.keyCode === 27) {
            cancelEdit();
          }
        }}
      >
        <Table<T>
          dataSource={dataSource}
          components={components}
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
            cancelEdit();
          }}
          size={tableSize}
          {...tableProps}
        />
      </Form>
    </div>
  );
};

export default BaseList;
