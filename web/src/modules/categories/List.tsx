import { Button } from "antd";
import { ColumnsType } from "antd/lib/table/Table";
import React, { useState } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import Color from "../../components/data/Color";
import {
  Category,
  fetchCategories,
  fetchCategoryTree
} from "../../dao/categories";
import BaseList from "../base/BaseList";

const Categories = ({ match }: RouteComponentProps) => {
  const [useTree, setUseTree] = useState(true);

  const columns: ColumnsType<Category> = [
    {
      title: "Name",
      dataIndex: "name",
      render(name, category) {
        return <Link to={`${match.url}/${category.pk}`}>{category.label}</Link>;
      }
    },
    {
      title: "Color",
      dataIndex: "color",
      render(value) {
        return <Color value={value} />;
      }
    },
    {
      align: "right",
      render(_, category) {
        return <Link to={`${match.url}/${category.pk}/edit`}>Edit</Link>;
      }
    }
  ];

  return (
    <BaseList<Category>
      itemName="Category"
      itemNamePlural="Categories"
      fetchItems={useTree ? fetchCategoryTree : fetchCategories}
      columns={columns}
      pagination={false}
      extraActions={false}
      actions={[
        <Link key="view" className="ant-btn" to={`${match.url}/tree`}>
          Tree View
        </Link>,
        <Button key="create" type="primary">
          <Link to={`${match.url}/create`}>Create Category</Link>
        </Button>
      ]}
      onSearch={search => setUseTree(!search)}
    />
  );
};

export default Categories;
