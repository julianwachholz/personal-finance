import { Table } from "antd";
import React, { useState } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import Color from "../../components/data/Color";
import { fetchCategories, fetchCategoryTree } from "../../dao/categories";
import BaseList from "../base/BaseList";

const { Column } = Table;

const Categories: React.FC<RouteComponentProps> = ({ match }) => {
  const [useTree, setUseTree] = useState(true);

  return (
    <BaseList
      itemName="Category"
      itemNamePlural="Categories"
      fetchItems={useTree ? fetchCategoryTree : fetchCategories}
      pagination={false}
      extraActions={false}
      onSearch={search => setUseTree(!search)}
    >
      <Column
        title="Name"
        dataIndex="name"
        render={(name, category: any) => (
          <Link to={`${match.url}/${category.pk}`}>{category.label}</Link>
        )}
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
