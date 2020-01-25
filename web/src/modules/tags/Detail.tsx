import { FormOutlined } from "@ant-design/icons";
import { Descriptions, Spin, Tag as TagComponent } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { RouteComponentProps } from "react-router-dom";
import { useTag } from "../../dao/tags";
import { prefetchTransactions } from "../../dao/transactions";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";
import RelatedTransactions from "../transactions/RelatedTransactions";

const { Item } = Descriptions;

interface DetailParams {
  pk: string;
}

const Tag = ({ match, history }: RouteComponentProps<DetailParams>) => {
  const [t] = useTranslation("tags");
  const { data: tag, isLoading, error } = useTag(match.params.pk);
  const filters = [`tags=${match.params.pk}`];
  prefetchTransactions({ filters });

  useTitle(tag && tag.label);
  return tag ? (
    <BaseModule
      title={tag.label}
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
      <Descriptions title={t("tags:tag", "Tag")}>
        <Item label={t("tags:tag_name", "Name")}>{tag.name}</Item>
        <Item label={t("tags:tag_color", "Color")}>
          <TagComponent color={tag.color}>{tag.color}</TagComponent>
        </Item>
      </Descriptions>
      <RelatedTransactions filters={filters} />
    </BaseModule>
  ) : (
    <Spin spinning={isLoading}>{error?.toString()}</Spin>
  );
};

export default Tag;
