import { Button, Descriptions, Spin } from "antd";
import React from "react";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { useCategory } from "../../dao/categories";
import BaseModule from "../base/BaseModule";
import RelatedTransactions, {
  prefetchRelatedTx
} from "../transactions/RelatedTransactions";

const { Item } = Descriptions;

interface DetailParams {
  pk: string;
}

const Category = ({ match }: RouteComponentProps<DetailParams>) => {
  const { data: category, isLoading, error } = useCategory(match.params.pk);
  const filters = [`category=${match.params.pk}`];
  prefetchRelatedTx(filters);

  return category ? (
    <BaseModule
      title={category.label}
      extra={[
        <Link key="edit" to={`${match.url}/edit`}>
          <Button type="primary">Edit Category</Button>
        </Link>,
        <Link key="delete" to={`${match.url}/delete`}>
          <Button type="danger">Delete Category</Button>
        </Link>
      ]}
    >
      <Descriptions title="Category">
        <Item label="ID">{category.pk}</Item>
        <Item label="Name">{category.name}</Item>
        <Item label="Color">{category.color}</Item>
      </Descriptions>
      <RelatedTransactions filters={filters} />
    </BaseModule>
  ) : (
    <Spin spinning={isLoading}>{error?.toString()}</Spin>
  );
};

export default Category;
