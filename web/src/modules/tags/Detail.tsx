import { Button, Descriptions, Spin } from "antd";
import React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import Color from "../../components/data/Color";
import { useTag } from "../../dao/tags";
import { prefetchTransactions } from "../../dao/transactions";
import BaseModule from "../base/BaseModule";
import RelatedTransactions from "../transactions/RelatedTransactions";

const { Item } = Descriptions;

interface DetailParams {
  pk: string;
}

const Tag = ({ match }: RouteComponentProps<DetailParams>) => {
  const { data: tag, isLoading, error } = useTag(match.params.pk);
  const filters = [`tags=${match.params.pk}`];
  prefetchTransactions({ filters });

  return tag ? (
    <BaseModule
      title={tag.label}
      extra={[
        <Link key="edit" to={`${match.url}/edit`}>
          <Button type="primary">Edit Tag</Button>
        </Link>
      ]}
    >
      <Descriptions title="Tag">
        <Item label="Name">{tag.name}</Item>
        <Item label="Color">
          <Color value={tag.color} />
        </Item>
      </Descriptions>
      <RelatedTransactions filters={filters} />
    </BaseModule>
  ) : (
    <Spin spinning={isLoading}>{error?.toString()}</Spin>
  );
};

export default Tag;
