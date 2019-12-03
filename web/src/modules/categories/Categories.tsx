import { Table } from "antd";
import React from "react";
import Color from "../../components/data/Color";
import { fetchCategories } from "../../dao/categories";
import ItemTable from "../base/ItemTable";

const { Column } = Table;

const Categories: React.FC = () => (
  <ItemTable
    itemName="Categories"
    fetchItems={fetchCategories}
    pagination={false}
  >
    <Column
      title="Name"
      dataIndex="name"
      sorter
      render={(name, category: any) => category.label}
    />
    <Column
      title="Color"
      dataIndex="color"
      render={value => <Color value={value} />}
    />
  </ItemTable>
);

export default Categories;
