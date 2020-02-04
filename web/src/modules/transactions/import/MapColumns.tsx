import { Alert, Form, Select } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ColumnMapping, ColumnMappingTarget } from "../../../dao/import";

interface MapColumnsProps {
  headers: string[];
  importConfigId?: number;
}

export const COLUMN_IGNORE = "__ignore__";
export const COLUMN_VALUE = "__value__";

const MapColumns = ({ headers, importConfigId }: MapColumnsProps) => {
  const [t] = useTranslation("transactions");
  const [form] = Form.useForm();

  const [mappings, setMappings] = useState<ColumnMapping[]>([]);

  const mapColumns = [
    ["datetime", t("date", "Date")],
    ["account", t("account", "Account")],
    ["amount", t("amount", "Amount")],
    ["payee", t("payee", "Payee")],
    ["category", t("category", "Category")],
    ["text", t("description", "Description")],
    // TODO
    // ["tags", t("tags", "Tags")],
    ["reference", t("reference_number", "Reference Number")]
  ];

  return (
    <Form form={form}>
      <h2>{t("import.columns.title", "Map Columns")}</h2>
      {importConfigId && (
        <Alert
          type="info"
          showIcon
          message={t(
            "import.config_imported",
            "We imported a previous import configuration! Your changes will be saved for the next time."
          )}
        />
      )}
      {mapColumns.map(([column, name]) => (
        <Form.Item
          key={column}
          name={column}
          label={name}
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
              const newMappings = mappings.filter(m => m.target !== column);
              if (value === COLUMN_IGNORE) {
                setMappings(newMappings);
                return;
              }
              const mapping: ColumnMapping = {
                target: column as ColumnMappingTarget,
                is_sourced: value !== COLUMN_VALUE,
                source: value === COLUMN_VALUE ? undefined : value,
                options: {}
              };
              const index = mapColumns.findIndex(([c]) => c === mapping.target);
              newMappings.splice(index, 0, mapping);
              form.setFieldsValue({
                [`mapping[${mapping.target}]`]: mapping
              });
              setMappings(newMappings);
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
