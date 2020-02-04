import { CheckCircleTwoTone } from "@ant-design/icons";
import { Col, Input, Radio, Row } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import CategorySelect from "../../../components/form/CategorySelect";
import DatePicker from "../../../components/form/DatePicker";
import ModelSelect from "../../../components/form/ModelSelect";
import { useAccounts } from "../../../dao/accounts";
import { ColumnMapping } from "../../../dao/import";
import { usePayees } from "../../../dao/payees";

interface MappingOptionsProps {
  value?: ColumnMapping;
  onChange?: (value: ColumnMapping) => void;
}

export const MappingOptions = ({ value, ...props }: MappingOptionsProps) => {
  if (value?.is_sourced) {
    return <ColumnMappingOptions value={value} {...props} />;
  } else {
    return <ColumnMappingValue value={value} {...props} />;
  }
};
export default MappingOptions;

const ColumnMappingOptions = ({ value, onChange }: MappingOptionsProps) => {
  const [t] = useTranslation("transactions");

  switch (value?.target) {
    case "datetime":
      return (
        <Row gutter={8}>
          <Col span={9}>
            <Radio.Group
              name="dayfirst"
              buttonStyle="solid"
              value={value.options?.dayfirst ?? true}
              onChange={e => {
                onChange?.({
                  ...value,
                  options: {
                    ...value.options,
                    dayfirst: e.target.value
                  }
                });
              }}
            >
              <Radio.Button value={true}>Day first</Radio.Button>
              <Radio.Button value={false}>Month first</Radio.Button>
            </Radio.Group>
          </Col>
          <Col span={9}>
            <Radio.Group
              name="yearfirst"
              buttonStyle="solid"
              value={value.options?.yearfirst ?? false}
              onChange={e => {
                onChange?.({
                  ...value,
                  options: {
                    ...value.options,
                    yearfirst: e.target.value
                  }
                });
              }}
            >
              <Radio.Button value={true}>Year first</Radio.Button>
              <Radio.Button value={false}>Year last</Radio.Button>
            </Radio.Group>
          </Col>
        </Row>
      );
    case "amount":
      return (
        <>
          <label>Decimal Separator: </label>
          <Radio.Group
            buttonStyle="solid"
            value={value.options?.decimal_separator ?? "."}
            onChange={e => {
              onChange?.({
                ...value,
                options: {
                  ...value.options,
                  decimal_separator: e.target.value
                }
              });
            }}
          >
            <Radio.Button value=".">.</Radio.Button>
            <Radio.Button value=",">,</Radio.Button>
          </Radio.Group>
        </>
      );
    // TODO
    // case "tags":
    //   return <span>Ready</span>;
    default:
      return (
        <>
          {t("import.columns.mapping_ready", "Ready")}{" "}
          <CheckCircleTwoTone twoToneColor="#52c41a" />
        </>
      );
  }
};

const ColumnMappingValue = ({ value, onChange }: MappingOptionsProps) => {
  switch (value?.target) {
    case "datetime":
      return (
        <DatePicker
          value={value.options?.value}
          onChange={date => {
            onChange!({
              ...value,
              options: {
                ...value.options,
                value: date as any
              }
            });
          }}
        />
      );
    case "account":
      return (
        <ModelSelect
          useItems={useAccounts}
          style={{ width: 200 }}
          value={value.options?.value && (value.options as any)}
          onChange={(account: any) => {
            onChange!({
              ...value,
              options: {
                ...value.options,
                ...account
              }
            });
          }}
        />
      );
    case "payee":
      return (
        <ModelSelect
          useItems={usePayees}
          style={{ width: 200 }}
          value={value.options?.value && (value.options as any)}
          onChange={(payee: any) => {
            onChange!({
              ...value,
              options: {
                ...value.options,
                ...payee
              }
            });
          }}
        />
      );
    case "category":
      return (
        <CategorySelect
          style={{ width: 200 }}
          value={value.options?.value && (value.options as any)}
          onChange={(category: any) => {
            onChange!({
              ...value,
              options: {
                ...value.options,
                ...category
              }
            });
          }}
        />
      );
    case "text":
      return (
        <Input
          style={{ width: 200 }}
          value={value.options?.value}
          onChange={e => {
            onChange!({
              ...value,
              options: {
                ...value.options,
                value: e.target.value
              }
            });
          }}
        />
      );
    default:
      // this should never happen
      return <>error</>;
  }
};
