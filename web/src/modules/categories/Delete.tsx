import { Button, List, message, Spin, Typography } from "antd";
import React from "react";
import { BrowserView, isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
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
  const [t] = useTranslation("categories");
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

  useTitle(
    category &&
      t("categories:delete", "Delete {{ label }}", { label: category.label })
  );
  return category ? (
    <BaseModule
      title={t("categories:delete", "Delete {{ label }}", {
        label: category.label
      })}
      onLeftClick={() => {
        history.go(-3);
      }}
    >
      <P>
        {t(
          "categories:delete_confirm",
          'Are you sure you want to delete the Category "{{ label }}"?',
          {
            label: category.label
          }
        )}
      </P>
      <P>
        {t(
          "categories:delete_related_warning",
          "The following associated records will also be deleted:"
        )}
      </P>
      <List
        dataSource={relatedItems}
        renderItem={item => <List.Item>{item}</List.Item>}
      />
      <Button
        type="danger"
        block={isMobile}
        size={isMobile ? "large" : "middle"}
        onClick={async () => {
          await mutate(category);
          message.info(
            t("categories:deleted", 'Category "{{ label }}" deleted', {
              label: category.label
            })
          );
          history.push(`/settings/categories`);
        }}
      >
        {t("categories:delete_submit", "Delete Category")}
      </Button>
      <BrowserView>
        <Link to={`/settings/categories/${category.pk}`}>
          <Button>{t("translation:cancel", "Cancel")}</Button>
        </Link>
      </BrowserView>
    </BaseModule>
  ) : (
    <Spin />
  );
};

export default CategoryDelete;
