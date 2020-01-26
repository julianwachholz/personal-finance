import { message } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { setQueryData, useMutation } from "react-query";
import { RouteComponentProps } from "react-router";
import { postCategory } from "../../dao/categories";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";
import CategoryForm from "./Form";

const CategoryCreate = ({ history }: RouteComponentProps) => {
  const [t] = useTranslation("categories");
  const [mutate] = useMutation(postCategory, {
    refetchQueries: ["items/categories", "items/categories/tree"]
  });

  useTitle(t("categories:create", "Create Category"));
  return (
    <BaseModule
      title={t("categories:create", "Create Category")}
      onLeftClick={() => {
        history.go(-1);
      }}
    >
      <CategoryForm
        onSave={async data => {
          try {
            const category = await mutate(data);
            setQueryData(["item/categories", { pk: category.pk }], category);
            message.success(t("categories:created", "Category created"));
            history.push(`/settings/categories`);
          } catch (e) {
            message.error(
              t("categories:create_error", "Category create failed")
            );
            throw e;
          }
        }}
      />
    </BaseModule>
  );
};

export default CategoryCreate;
