import { Descriptions, Spin } from "antd";
import React from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { usePayee } from "../../dao/payees";
import { prefetchTransactions } from "../../dao/transactions";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";
import RelatedTransactions from "../transactions/RelatedTransactions";

const { Item } = Descriptions;

interface DetailParams {
  pk: string;
}

const Payee = ({ match }: RouteComponentProps<DetailParams>) => {
  const history = useHistory();
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
    >
      <Descriptions title="Payee">
        <Item label="Name">{payee.name}</Item>
        <Item label="Type">{payee.type}</Item>
        <Item label="Default Category">{payee.default_category?.label}</Item>
      </Descriptions>
      <RelatedTransactions filters={filters} excludeColumns={["payee"]} />
    </BaseModule>
  ) : (
    <Spin spinning={isLoading}>{error?.toString()}</Spin>
  );
};

export default Payee;
