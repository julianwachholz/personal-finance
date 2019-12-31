import { Button, Descriptions, Spin } from "antd";
import React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { usePayee } from "../../dao/payees";
import BaseModule from "../base/BaseModule";
import RelatedTransactions, {
  prefetchRelatedTx
} from "../transactions/RelatedTransactions";

const { Item } = Descriptions;

interface DetailParams {
  pk: string;
}

const Payee = ({ match }: RouteComponentProps<DetailParams>) => {
  const { data: payee, isLoading, error } = usePayee(match.params.pk);
  const filters = [`payee=${match.params.pk}`];
  prefetchRelatedTx(filters);

  return payee ? (
    <BaseModule
      title={payee.name}
      extra={[
        <Link key="edit" to={`${match.url}/edit`}>
          <Button type="primary">Edit Payee</Button>
        </Link>
      ]}
    >
      <Descriptions title="Payee">
        <Item label="Name">{payee.name}</Item>
        <Item label="Type">{payee.type}</Item>
      </Descriptions>
      <RelatedTransactions filters={filters} excludeColumns={["payee"]} />
    </BaseModule>
  ) : (
    <Spin spinning={isLoading}>{error?.toString()}</Spin>
  );
};

export default Payee;
