import {
  CheckCircleTwoTone,
  ClockCircleTwoTone,
  LoadingOutlined
} from "@ant-design/icons";
import { Col, List, Row, Spin, Tabs, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import CategorySelect from "../../../components/form/CategorySelect";
import ModelSelect from "../../../components/form/ModelSelect";
import { RelatedModel } from "../../../dao/base";
import {
  fetchUnmappedValues,
  ImportConfig,
  ValueMappingModel
} from "../../../dao/import";
import { patchPayee, postPayee, usePayees } from "../../../dao/payees";
import { COLOR_SUCCESS, COLOR_WARNING } from "../../../utils/constants";
import ColumnName from "./ColumnName";

export type ImportValueMappings = {
  [M in ValueMappingModel]?: ImportValueMapping[];
};

interface ImportValueMapping {
  content_type: ValueMappingModel;
  value: string;
  target?: RelatedModel;
  created?: boolean;

  default_category?: RelatedModel;
}

interface MapValuesProps {
  fileIds: number[];
  importConfig: ImportConfig;
  valueMappings?: ImportValueMappings;
  onChange: (valueMappings: ImportValueMappings) => void;
}

export const MapValues = ({
  fileIds,
  importConfig,
  valueMappings,
  onChange
}: MapValuesProps) => {
  const [t] = useTranslation("transactions");

  useEffect(() => {
    if (!valueMappings) {
      Promise.all(
        fileIds.map(file =>
          fetchUnmappedValues({
            pk: importConfig.pk,
            file
          })
        )
      ).then(results => {
        const unmappedValues = results.reduce((all, unmapped) => {
          Object.entries(unmapped).forEach(([key, values]) => {
            const model = key as ValueMappingModel;
            if (all[model]) {
              all[model] = Array.from(new Set([...all[model]!, ...values!]));
            } else {
              all[model] = values;
            }
          });
          return all;
        }, {});

        const valueMappings = Object.fromEntries(
          Object.entries(unmappedValues).map(([key, values]) => {
            const model = key as ValueMappingModel;
            return [
              model,
              values!.map(value => ({
                content_type: model,
                value
              }))
            ];
          })
        );
        onChange(valueMappings);
      });
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <h2>{t("import.values.title", "Map Values")}</h2>
      {valueMappings ? (
        <Tabs animated={false}>
          {Object.keys(valueMappings).map(key => {
            const model = key as ValueMappingModel;
            const mappings = valueMappings[model]!;
            const mapped = mappings.filter(m => m.target).length;

            return (
              <Tabs.TabPane
                key={model}
                tab={
                  <>
                    {mapped === mappings.length ? (
                      <CheckCircleTwoTone twoToneColor={COLOR_SUCCESS} />
                    ) : (
                      <ClockCircleTwoTone twoToneColor={COLOR_WARNING} />
                    )}
                    <ColumnName name={model} /> ({mapped}/{mappings.length})
                  </>
                }
              >
                <List
                  pagination={{
                    pageSize: 5,
                    hideOnSinglePage: true
                  }}
                  dataSource={mappings}
                  renderItem={(item: ImportValueMapping, i) => (
                    <List.Item key={`${model}-${i}`} className="list-item-row">
                      <MapValueForm
                        mapping={item}
                        onChange={mapping => {
                          const modelMappings = [...mappings];
                          const index = modelMappings.findIndex(
                            m => m.value === mapping.value
                          );
                          modelMappings[index] = mapping;
                          onChange({
                            ...valueMappings,
                            [model]: modelMappings
                          });
                        }}
                      />
                    </List.Item>
                  )}
                />
              </Tabs.TabPane>
            );
          })}
        </Tabs>
      ) : (
        <Spin
          indicator={<LoadingOutlined />}
          tip={t("translation:loading", "Loading...")}
        />
      )}
    </div>
  );
};

export default MapValues;

interface MapValueFormProps {
  mapping: ImportValueMapping;
  onChange: (mapping: ImportValueMapping) => void;
}

export const MapValueForm = ({ mapping, onChange }: MapValueFormProps) => {
  const useItems = usePayees;
  const createItem = postPayee;
  const withCategory = true;

  const [loading, setLoading] = useState(false);
  const [setDefaultCategory] = useMutation(patchPayee);

  const [create] = useMutation(createItem);

  let SourceWrap: any = React.Fragment;
  let wrapProps = {};

  if (mapping.value.length > 40) {
    SourceWrap = Tooltip;
    wrapProps = { title: mapping.value, placement: "bottomLeft" };
  }

  return (
    <Row align="middle" gutter={16}>
      <Col className="text-overflow" span={withCategory ? 8 : 12}>
        <SourceWrap {...wrapProps}>{mapping.value}</SourceWrap>
      </Col>
      <Col span={withCategory ? 8 : 12}>
        <ModelSelect
          allowClear
          value={mapping.target}
          useItems={useItems}
          onChange={(value: any) => {
            onChange({ ...mapping, target: value as RelatedModel });
          }}
          createItem={async name => {
            const obj = await create({ name } as any);
            onChange({
              ...mapping,
              created: true,
              target: { value: obj.pk, label: obj.label }
            });
          }}
        />
      </Col>
      {withCategory && mapping.created ? (
        <Col span={8}>
          <CategorySelect
            size="middle"
            loading={loading}
            value={mapping.default_category}
            onChange={async default_category => {
              setLoading(true);
              onChange({ ...mapping, default_category });
              await setDefaultCategory({
                pk: mapping.target!.value,
                default_category
              });
              setLoading(false);
            }}
            placeholder={`Set category for ${mapping.target?.label}`}
          />
        </Col>
      ) : null}
    </Row>
  );
};
