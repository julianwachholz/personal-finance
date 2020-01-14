import { message } from "antd";
import React from "react";
import { setQueryData, useMutation } from "react-query";
import { useHistory } from "react-router";
import { postCategory } from "../../dao/categories";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";
import CategoryForm from "./Form";

const CategoryCreate = () => {
  const [mutate] = useMutation(postCategory, {
    refetchQueries: ["items/categories", "items/categories/tree"]
  });
  const history = useHistory();

  useTitle(`Create Category`);
  return (
    <BaseModule
      title="Create Category"
      onLeftClick={() => {
        history.go(-1);
      }}
    >
      <CategoryForm
        onSave={async data => {
          try {
            const category = await mutate(data);
            setQueryData(["item/categories", { pk: category.pk }], category);
            message.success("Category created");
            history.push(`/settings/categories`);
          } catch (e) {
            message.error("Category create failed");
            throw e;
          }
        }}
      />
    </BaseModule>
  );
};

export default CategoryCreate;
