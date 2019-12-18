import { Button, Descriptions } from "antd";
import React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { useTag } from "../../dao/tags";
import BaseModule from "../base/BaseModule";

const { Item } = Descriptions;

interface IDetailParams {
  pk: string;
}

const Tag: React.FC<RouteComponentProps<IDetailParams>> = ({ match }) => {
  const { data: tag } = useTag(match.params.pk);

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
  ) : null;
};

export default Tag;
