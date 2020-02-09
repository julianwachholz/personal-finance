import { Alert, Form, Select } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  ColumnMapping,
  ColumnMappingTarget,
  ImportConfig
} from "../../../dao/import";
import ColumnName, { COLUMNS } from "./ColumnName";

interface MapColumnsProps {
  headers: string[];
  importConfig: ImportConfig | null;

  onChange: (importConfig: ImportConfig) => void;
}

export const COLUMN_IGNORE = "__ignore__";
export const COLUMN_VALUE = "__value__";

const getInitialValues = (importConfig: ImportConfig | null) => {
  if (importConfig === null) {
    return {};
  }
  return Object.fromEntries(
    COLUMNS.map(column => {
      const mapping = importConfig.mappings.find(m => m.target === column);
      if (mapping) {
        if (mapping.is_sourced && mapping.source) {
          return [column, mapping.source];
        } else {
          return [column, COLUMN_VALUE];
        }
      }
      return [column, COLUMN_IGNORE];
    })
  );
};

const MapColumns = ({ headers, importConfig, onChange }: MapColumnsProps) => {
  const [t] = useTranslation("transactions");
  const [form] = Form.useForm();

  // if (importConfig === null) {
  //   importConfig = {
  //     file_type: "text/csv",
  //     mappings: []
  //   } as any;
  // }

  return (
    <Form
      form={form}
      layout="horizontal"
      wrapperCol={{ span: 10 }}
      labelCol={{ span: 6 }}
      initialValues={getInitialValues(importConfig)}
    >
      <h2>{t("import.columns.title", "Map Columns")}</h2>
      {importConfig && (
        <Alert
          type="info"
          showIcon
          message={t(
            "import.config_imported",
            "We imported a previous import configuration! Your changes will be saved for the next time."
          )}
        />
      )}
      {COLUMNS.map(column => (
        <Form.Item
          key={column}
          name={column}
          label={<ColumnName name={column} />}
          required={false}
          extra={
            column === "reference" &&
            t(
              "import.columns.map_reference_help",
              "A unqiue identifier for a transaction."
            )
          }
          rules={[
            {
              required: true,
              message: t(
                "import.columns.mapping_required",
                "Please select a mapping"
              )
            }
          ]}
        >
          <Select
            onChange={(value: string) => {
              const mappings =
                importConfig?.mappings.filter(m => m.target !== column) ?? [];

              if (value === COLUMN_IGNORE) {
                onChange({ file_type: "text/csv", ...importConfig!, mappings });
                return;
              }

              const mapping: ColumnMapping = {
                target: column as ColumnMappingTarget,
                is_sourced: value !== COLUMN_VALUE,
                source: value === COLUMN_VALUE ? undefined : value,
                options: {}
              };
              const index = COLUMNS.findIndex(
                column => column === mapping.target
              );
              mappings.splice(index, 0, mapping);
              form.setFieldsValue({
                [`mapping[${mapping.target}]`]: mapping
              });
              onChange({ file_type: "text/csv", ...importConfig!, mappings });
            }}
          >
            {column !== "amount" && (
              <Select.OptGroup
                label={t("import.columns.mapping_functions", "Functions")}
              >
                <Select.Option value={COLUMN_IGNORE}>
                  {t("import.columns.mapping_ignore", "Ignore this column")}
                </Select.Option>
                {column !== "reference" && (
                  <Select.Option value={COLUMN_VALUE}>
                    {t("import.columns.mapping_value", "Supply a fixed value")}
                  </Select.Option>
                )}
              </Select.OptGroup>
            )}
            <Select.OptGroup
              label={t("import.columns.mapping_fields", "Fields")}
            >
              {headers?.map(header => (
                <Select.Option key={header} value={header}>
                  {header}
                </Select.Option>
              ))}
            </Select.OptGroup>
          </Select>
        </Form.Item>
      ))}
    </Form>
  );
};

export default MapColumns;
