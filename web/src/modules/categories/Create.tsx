import { message } from "antd";
import React from "react";
import { setQueryData, useMutation } from "react-query";
import { useHistory } from "react-router";
import { postCategory } from "../../dao/categories";
import BaseModule from "../base/BaseModule";
import CategoryForm from "./Form";

const CategoryCreate: React.FC = () => {
  const [mutate] = useMutation(postCategory, {
    refetchQueries: ["items/categories", "items/categories/tree"]
  });
  const history = useHistory();

  return (
    <BaseModule title="Create Category">
      <CategoryForm
        onSave={async data => {
          try {
            const category = await mutate(data);
            setQueryData(["item/categories", { pk: category.pk }], category);
            message.success("Category created!");
            history.push(`/settings/categories/${category.pk}`);
          } catch (e) {
            message.error("Category create failed!");
          }
        }}
      />
    </BaseModule>
  );
};

export default CategoryCreate;
