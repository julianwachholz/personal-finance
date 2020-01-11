import { Table } from "antd";
import React from "react";
import { useLocation } from "react-router";
import { Transaction, useTransactions } from "../../dao/transactions";
import { useSettings } from "../../utils/SettingsProvider";
import { BaseTableLocationState } from "../base/BaseTable";
import getGetColumns from "./columns";

interface RelatedTransactionsProps {
  filters: string[];
  excludeColumns?: string[];
}

const RelatedTransactions = ({
  filters,
  excludeColumns = []
}: RelatedTransactionsProps) => {
  const { tableSize } = useSettings();
  const location = useLocation<BaseTableLocationState>();
  const filteredColumns = getGetColumns()(location).filter(
    col => !excludeColumns.includes(col.dataIndex as string)
  );

  const { data, isLoading } = useTransactions({ filters });

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
