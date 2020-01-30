import { Form } from "antd";
import { ColumnType } from "antd/lib/table/interface";
import { FormInstance } from "rc-field-form";
import { Rule } from "rc-field-form/lib/interface";
import React, { HTMLAttributes } from "react";
import { useTranslation } from "react-i18next";
import { Model } from "../../dao/base";
import "./BaseModule.scss";

type FormField =
  | React.ReactElement
  | ((form: FormInstance) => React.ReactElement);

interface EditableColumnType<T> extends ColumnType<T> {
  editable?: boolean;
  formField?: FormField;
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
  const [t] = useTranslation();
  return (
    <td {...props}>
      {editing ? (
        <Form.Item
          name={name}
          rules={
            rules ?? [
              {
                required: true,
                message: t(
                  "form.error.field_required",
                  "{{ name }} is required",
                  {
                    field: title
                  }
                )
              }
            ]
          }
        >
          {field}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
