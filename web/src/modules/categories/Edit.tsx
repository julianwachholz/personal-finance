import { message, Spin } from "antd";
import React from "react";
import { useMutation } from "react-query";
import { RouteComponentProps, useHistory } from "react-router";
import { putCategory, useCategory } from "../../dao/categories";
import BaseModule from "../base/BaseModule";
import CategoryForm from "./Form";

interface DetailParams {
  pk: string;
}
const CategoryEdit = ({ match }: RouteComponentProps<DetailParams>) => {
  const pk = parseInt(match.params.pk, 10);
  const { data, isLoading } = useCategory(pk);

  const [mutate] = useMutation(putCategory, {
    refetchQueries: ["items/categories", "items/categories/tree"]
  });
  const history = useHistory();

  if (!data || isLoading) {
    return <Spin />;
  }

  return (
    <BaseModule title={`Edit ${data.label}`}>
      <CategoryForm
        data={data}
        onSave={async data => {
          try {
            await mutate(
              { pk, ...data },
              { updateQuery: ["item/categories", { pk }] }
            );
            message.success("Category updated!");
            history.push(`/settings/categories/${pk}`);
          } catch (e) {
            message.error("Category update failed!");
          }
        }}
      />
    </BaseModule>
  );
};

export default CategoryEdit;
