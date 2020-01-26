import { DeleteFilled } from "@ant-design/icons";
import { message, Spin } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { RouteComponentProps } from "react-router";
import { putCategory, useCategory } from "../../dao/categories";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";
import CategoryForm from "./Form";

interface DetailParams {
  pk: string;
}
const CategoryEdit = ({
  match,
  history
}: RouteComponentProps<DetailParams>) => {
  const [t] = useTranslation("categories");
  const pk = parseInt(match.params.pk, 10);
  const { data: category, isLoading } = useCategory(pk);

  const [mutate] = useMutation(putCategory, {
    refetchQueries: ["items/categories", "items/categories/tree"]
  });

  useTitle(
    category &&
      t("categories:edit", "Edit {{ label }}", { label: category.label })
  );

  if (!category || isLoading) {
    return <Spin />;
  }

  return (
    <BaseModule
      title={t("categories:edit", "Edit {{ label }}", {
        label: category.label
      })}
      onLeftClick={() => {
        history.go(-2);
      }}
      rightContent={
        <DeleteFilled
          onClick={() => {
            history.push(`/settings/categories/${category.pk}/delete`);
          }}
        />
      }
    >
      <CategoryForm
        data={category}
        onSave={async data => {
          try {
            await mutate(data, { updateQuery: ["item/categories", { pk }] });
            message.success(t("categories:updated", "Category updated"));
            history.push(`/settings/categories`);
          } catch (e) {
            message.error(
              t("categories:update_error", "Category update failed")
            );
            throw e;
          }
        }}
      />
    </BaseModule>
  );
};

export default CategoryEdit;
