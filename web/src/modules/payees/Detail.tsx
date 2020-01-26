import { FormOutlined } from "@ant-design/icons";
import { Descriptions, Spin } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { RouteComponentProps } from "react-router-dom";
import { usePayee } from "../../dao/payees";
import { prefetchTransactions } from "../../dao/transactions";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";
import RelatedTransactions from "../transactions/RelatedTransactions";

const { Item } = Descriptions;

interface DetailParams {
  pk: string;
}

const Payee = ({ match, history }: RouteComponentProps<DetailParams>) => {
  const [t] = useTranslation("payees");
  const { data: payee, isLoading, error } = usePayee(match.params.pk);
  const filters = [`payee=${match.params.pk}`];
  prefetchTransactions({ filters });

  useTitle(payee && payee.label);
  return payee ? (
    <BaseModule
      title={payee.name}
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
      <Descriptions title={t("payees:payee", "Payee")}>
        <Item label={t("payees:name", "Name")}>{payee.name}</Item>
        <Item label={t("payees:type", "Type")}>
          {payee.type === "business"
            ? t("payees:type_business", "Business")
            : t("payees:type_person", "Person")}
        </Item>
        <Item label={t("payees:default_category", "Default Category")}>
          {payee.default_category?.label}
        </Item>
      </Descriptions>
      <RelatedTransactions filters={filters} excludeColumns={["payee"]} />
    </BaseModule>
  ) : (
    <Spin spinning={isLoading}>{error?.toString()}</Spin>
  );
};

export default Payee;
