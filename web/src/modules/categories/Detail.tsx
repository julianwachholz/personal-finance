import { FormOutlined } from "@ant-design/icons";
import { Button, Descriptions, Spin, Tag } from "antd";
import React from "react";
import { RouteComponentProps, useHistory } from "react-router";
import { Link } from "react-router-dom";
import { useCategory } from "../../dao/categories";
import { prefetchTransactions } from "../../dao/transactions";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";
import RelatedTransactions from "../transactions/RelatedTransactions";

const { Item } = Descriptions;

interface DetailParams {
  pk: string;
}

const Category = ({ match }: RouteComponentProps<DetailParams>) => {
  const history = useHistory();
  const { data: category, isLoading, error } = useCategory(match.params.pk);
  const filters = [`category=${match.params.pk}`];
  prefetchTransactions({ filters });

  useTitle(category && category.label);
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
      onLeftClick={() => {
        history.go(-1);
      }}
      rightContent={
        <FormOutlined
          onClick={() => {
            history.push(`${match.url}/edit`);
          }}
        />
      }
    >
      <Descriptions title="Category">
        <Item label="Name">{category.name}</Item>
        <Item label="Icon">{category.icon}</Item>
        <Item label="Color">
          <Tag color={category.color}>{category.color}</Tag>
        </Item>
        {category.parent ? (
          <Item label="Parent">
            <Link to={`/settings/categories/${category.parent.pk}`}>
              {category.parent.label}
            </Link>
          </Item>
        ) : null}
      </Descriptions>
      <RelatedTransactions filters={filters} />
    </BaseModule>
  ) : (
    <Spin spinning={isLoading}>{error?.toString()}</Spin>
  );
};

export default Category;
