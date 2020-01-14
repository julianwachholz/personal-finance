import { DeleteFilled } from "@ant-design/icons";
import { message, Modal, Spin } from "antd";
import React from "react";
import { useMutation } from "react-query";
import { RouteComponentProps, useHistory } from "react-router";
import { putCategory, useCategory } from "../../dao/categories";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";
import CategoryForm from "./Form";

interface DetailParams {
  pk: string;
}
const CategoryEdit = ({ match }: RouteComponentProps<DetailParams>) => {
  const pk = parseInt(match.params.pk, 10);
  const { data: category, isLoading } = useCategory(pk);

  const [mutate] = useMutation(putCategory, {
    refetchQueries: ["items/categories", "items/categories/tree"]
  });
  const history = useHistory();

  useTitle(category && `Edit ${category.label}`);

  if (!category || isLoading) {
    return <Spin />;
  }

  return (
    <BaseModule
      title={`Edit ${category.label}`}
      onLeftClick={() => {
        history.go(-2);
      }}
      rightContent={
        <DeleteFilled
          onClick={() => {
            Modal.confirm({
              title: `Delete Category "${category.label}"?`,
              icon: <DeleteFilled />,
              content:
                "This will delete the category and remove it from all associated transactions.",
              okText: "Delete",
              okButtonProps: { type: "danger" }
            });
          }}
        />
      }
    >
      <CategoryForm
        data={category}
        onSave={async data => {
          try {
            await mutate(data, { updateQuery: ["item/categories", { pk }] });
            message.success("Category updated");
            history.push(`/settings/categories`);
          } catch (e) {
            message.error("Category update failed");
            throw e;
          }
        }}
      />
    </BaseModule>
  );
};

export default CategoryEdit;
