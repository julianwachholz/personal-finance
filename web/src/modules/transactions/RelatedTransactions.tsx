import { Table } from "antd";
import { ActivityIndicator, List } from "antd-mobile";
import React from "react";
import { isMobile } from "react-device-detect";
import { useHistory, useLocation } from "react-router";
import { Transaction, useTransactions } from "../../dao/transactions";
import { useSettings } from "../../utils/SettingsProvider";
import { BaseTableLocationState } from "../base/BaseTable";
import getGetColumns from "./columns";
import { renderTransaction } from "./List";

interface RelatedTransactionsProps {
  filters: string[];
  excludeColumns?: string[];
}

const RelatedTransactions = ({
  filters,
  excludeColumns = []
}: RelatedTransactionsProps) => {
  const history = useHistory();
  const { tableSize } = useSettings();
  const location = useLocation<BaseTableLocationState>();
  const filteredColumns = getGetColumns()(location).filter(
    col => !excludeColumns.includes(col.dataIndex as string)
  );

  const { data, isLoading } = useTransactions({ filters });

  if (isMobile) {
    return isLoading ? (
      <ActivityIndicator text="Loading Recent Transactions" />
    ) : (
      <List renderHeader="Recent Transactions">
        {data?.results.map(renderTransaction.bind(null, history, false))}
      </List>
    );
  }

  return (
    <Table<Transaction>
      title={() => `Recent Transactions`}
      showHeader={true}
      dataSource={data?.results ?? []}
      columns={filteredColumns}
      loading={isLoading}
      rowKey="pk"
      pagination={false}
      size={tableSize}
    />
  );
};

export default RelatedTransactions;
