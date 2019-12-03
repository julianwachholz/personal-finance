import { Table } from "antd";
import React from "react";
import Color from "../../components/data/Color";
import ItemTable, { FetchItems } from "../base/ItemTable";

const { Column } = Table;

const fetchTags: FetchItems = async ({ page, pageSize, ordering, search }) => {
  let url = `/api/tags/?page=${page}`;
  if (pageSize) {
    url += `&page_size=${pageSize}`;
  }
  if (ordering) {
    url += `&ordering=${ordering}`;
  }
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const Tags: React.FC = () => (
  <ItemTable itemName="Tags" fetchItems={fetchTags}>
    <Column title="Name" dataIndex="name" sorter render={name => `#${name}`} />
    <Column
      title="Color"
      dataIndex="color"
      render={value => <Color value={value} />}
    />
  </ItemTable>
);

export default Tags;
