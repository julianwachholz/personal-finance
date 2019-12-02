import { Table } from "antd";
import React from "react";
import ItemTable, { FetchItems } from "../base/ItemTable";

const { Column } = Table;

const fetchCategories: FetchItems = async ({
  page,
  pageSize,
  ordering,
  search
}) => {
  let url = `/api/categories/?page=${page}`;
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

const Categories: React.FC = () => (
  <ItemTable itemName="Categories" fetchItems={fetchCategories}>
    <Column
      title="Name"
      dataIndex="name"
      sorter
      render={(name, category: any) => `${category.get_icon} ${name}`}
    />
  </ItemTable>
);

export default Categories;
