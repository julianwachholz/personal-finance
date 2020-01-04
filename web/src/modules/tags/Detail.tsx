import { Descriptions, Spin, Tag as TagComp } from "antd";
import React from "react";
import { RouteComponentProps } from "react-router-dom";
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
    <BaseModule title={tag.label}>
      <Descriptions title="Tag">
        <Item label="Name">{tag.name}</Item>
        <Item label="Color">
          <TagComp color={tag.color} />
        </Item>
      </Descriptions>
      <RelatedTransactions filters={filters} />
    </BaseModule>
  ) : (
    <Spin spinning={isLoading}>{error?.toString()}</Spin>
  );
};

export default Tag;
