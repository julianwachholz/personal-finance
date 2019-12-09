import { Table, Button } from "antd";
import React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import Color from "../../components/data/Color";
import { fetchTags } from "../../dao/tags";
import BaseList from "../base/BaseList";

const { Column } = Table;

const Tags: React.FC<RouteComponentProps> = ({ match }) => (
  <BaseList
    itemName="Tag"
    itemNamePlural="Tags"
    fetchItems={fetchTags}
    extraActions={[<Link to="#">Example</Link>]}
    actions={[
      <Button key="create" type="primary">
        <Link to={`${match.url}/create`}>Create Tag</Link>
      </Button>
    ]}
  >
    <Column
      title="Name"
      dataIndex="name"
      sorter
      render={(name, tag: any) => (
        <Link to={`${match.url}/${tag.pk}`}>#{name}</Link>
      )}
    />
    <Column
      title="Color"
      dataIndex="color"
      render={value => <Color value={value} />}
    />
  </BaseList>
);

export default Tags;
