import { Button, Descriptions, Spin } from "antd";
import React from "react";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { useCategory } from "../../dao/categories";
import BaseModule from "../base/BaseModule";

const { Item } = Descriptions;

interface IDetailParams {
  pk: string;
}

const Category: React.FC<RouteComponentProps<IDetailParams>> = ({ match }) => {
  const { data: category } = useCategory(match.params.pk);

  return category ? (
    <BaseModule title={category.label}>
      <Descriptions title="Category">
        <Item label="ID">{category.pk}</Item>
        <Item label="Name">{category.name}</Item>
        <Item label="Color">{category.color}</Item>
      </Descriptions>
      <Link to={`${match.url}/edit`}>
        <Button type="primary">Edit Category</Button>
      </Link>
    </BaseModule>
  ) : (
    <Spin />
  );
};

export default Category;