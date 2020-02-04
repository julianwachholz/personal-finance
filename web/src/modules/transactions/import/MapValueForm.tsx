import { Col, Row } from "antd";
import React, { useState } from "react";
import { useMutation } from "react-query";
import CategorySelect from "../../../components/form/CategorySelect";
import ModelSelect from "../../../components/form/ModelSelect";
import { ModelWithLabel, MutateItem, UseItems } from "../../../dao/base";

interface MapValueFormProps<P extends ModelWithLabel> {
  item: string;
  useItems: UseItems<P>;
  createItem: MutateItem<P, P>;
  withCategory?: boolean;
}

export const MapValueForm = <P extends ModelWithLabel>(
  props: MapValueFormProps<P>
) => {
  const { item, useItems, createItem, withCategory } = props;
  const [create] = useMutation(createItem);
  const [mappedObject, setMappedObject] = useState<P>();
  const [created, setCreated] = useState(false);

  return (
    <Row align="middle" gutter={16}>
      <Col span={withCategory ? 8 : 12}>{item}</Col>
      <Col span={withCategory ? 8 : 12}>
        <ModelSelect
          useItems={useItems}
          createItem={async name => {
            const newObject = await create({ name } as any);
            setMappedObject(newObject);
            setCreated(true);
          }}
        />
      </Col>
      {withCategory && mappedObject && created ? (
        <Col span={8}>
          <CategorySelect
            placeholder={`Set default category for ${mappedObject.label}`}
          />
        </Col>
      ) : null}
    </Row>
  );
};

export default MapValueForm;
