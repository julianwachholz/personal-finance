import { Button, List, message, Spin, Typography } from "antd";
import React from "react";
import { useMutation } from "react-query";
import { Link, RouteComponentProps } from "react-router-dom";
import { deleteCategory, useCategory } from "../../dao/categories";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";

const { Paragraph: P } = Typography;

interface DeleteParams {
  pk: string;
}

const CategoryDelete = ({
  match,
  history
}: RouteComponentProps<DeleteParams>) => {
  const { data: category } = useCategory(match.params.pk);
  const relatedItems = [
    "Transaction #54342",
    "Transaction #56907",
    "Transaction #06812",
    "Transaction #87514"
  ];

  const [mutate] = useMutation(deleteCategory, {
    refetchQueries: ["items/categories", "items/categories/tree"]
  });

  useTitle(category && `Delete ${category.label}`);
  return category ? (
    <BaseModule title={`Delete ${category.label}`}>
      <P>Are you sure you want to delete the Category "{category.label}"?</P>
      <P>The following associated records will also be deleted:</P>
      <List
        dataSource={relatedItems}
        renderItem={item => <List.Item>{item}</List.Item>}
      />
      <Button
        type="danger"
        onClick={async () => {
          await mutate(category);
          message.info(`Category "${category.label}" deleted.`);
          history.push(`/settings/categories`);
        }}
      >
        Delete Category
      </Button>
      <Link to={`/settings/categories/${category.pk}`}>
        <Button>Cancel</Button>
      </Link>
    </BaseModule>
  ) : (
    <Spin />
  );
};

export default CategoryDelete;
