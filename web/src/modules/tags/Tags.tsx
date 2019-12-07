import { Table } from "antd";
import React from "react";
import Color from "../../components/data/Color";
import { fetchTags } from "../../dao/tags";
import BaseList from "../base/BaseList";

const { Column } = Table;

const Tags: React.FC = () => (
  <BaseList itemName="Tags" fetchItems={fetchTags}>
    <Column title="Name" dataIndex="name" sorter render={name => `#${name}`} />
    <Column
      title="Color"
      dataIndex="color"
      render={value => <Color value={value} />}
    />
  </BaseList>
);

export default Tags;
