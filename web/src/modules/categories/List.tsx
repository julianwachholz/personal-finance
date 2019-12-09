import { Table } from "antd";
import React, { useState } from "react";
import Color from "../../components/data/Color";
import { fetchCategories, fetchCategoryTree } from "../../dao/categories";
import BaseList, { getColumnSearchProps } from "../base/BaseList";

const { Column } = Table;

const Categories: React.FC = () => {
  const [useTree, setUseTree] = useState(true);

  return (
    <BaseList
      itemName="Category"
      itemNamePlural="Categories"
      fetchItems={useTree ? fetchCategoryTree : fetchCategories}
      pagination={false}
      showSearch={false}
      extraActions={false}
    >
      <Column
        title="Name"
        dataIndex="name"
        render={(name, category: any) => category.label}
        {...getColumnSearchProps(value => {
          setUseTree(!value);
        })}
      />
      <Column
        title="Color"
        dataIndex="color"
        render={value => <Color value={value} />}
      />
    </BaseList>
  );
};

export default Categories;
