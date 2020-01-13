import { Form } from "antd";
import { ColumnType } from "antd/lib/table/interface";
import { FormInstance } from "rc-field-form";
import { Rule } from "rc-field-form/lib/interface";
import React, { HTMLAttributes } from "react";
import { Model } from "../../dao/base";
import "./BaseModule.scss";

type FormField =
  | React.ReactElement
  | ((form: FormInstance) => React.ReactElement);

interface EditableColumnType<T> extends ColumnType<T> {
  editable?: boolean;
  formName?: string;
  formField?: FormField;

  // Get the form value entry from an existing value, in addition to the actual value
  formValue?: (key: string, value: any) => [string, any];

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

export const EditableCell: React.FC<any> = <T extends Model>({
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
