import { Button, Descriptions, Spin } from "antd";
import React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { usePayee } from "../../dao/payees";
import BaseModule from "../base/BaseModule";

const { Item } = Descriptions;

interface DetailParams {
  pk: string;
}

const Payee = ({ match }: RouteComponentProps<DetailParams>) => {
  const { data: payee, isLoading, error } = usePayee(match.params.pk);

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
        <Item label="ID">{payee.pk}</Item>
        <Item label="Name">{payee.name}</Item>
        <Item label="Type">{payee.type}</Item>
      </Descriptions>
    </BaseModule>
  ) : (
    <Spin spinning={isLoading}>{error?.toString()}</Spin>
  );
};

export default Payee;
