import { Button, Descriptions, Spin } from "antd";
import React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { useTag } from "../../dao/tags";
import BaseModule from "../base/BaseModule";

const { Item } = Descriptions;

interface DetailParams {
  pk: string;
}

const Tag = ({ match }: RouteComponentProps<DetailParams>) => {
  const { data: tag, isLoading, error } = useTag(match.params.pk);

  return tag ? (
    <BaseModule title={tag.label}>
      <Descriptions title="Tag">
        <Item label="ID">{tag.pk}</Item>
        <Item label="Name">{tag.name}</Item>
        <Item label="Color">{tag.color}</Item>
      </Descriptions>
      <Link to={`${match.url}/edit`}>
        <Button type="primary">Edit Tag</Button>
      </Link>
    </BaseModule>
  ) : (
    <Spin spinning={isLoading}>{error?.toString()}</Spin>
  );
};

export default Tag;
