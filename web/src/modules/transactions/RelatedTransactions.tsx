import { Table } from "antd";
import React from "react";
import { prefetchQuery } from "react-query";
import {
  fetchTransactions,
  Transaction,
  useTransactions
} from "../../dao/transactions";
import { useSettings } from "../../utils/SettingsProvider";
import columns from "./columns";

export const prefetchRelatedTx = (filters: string[]) => {
  prefetchQuery(["items/transactions", { filters }], fetchTransactions, {
    staleTime: 500
  });
};

interface RelatedTransactionsProps {
  filters: string[];
  excludeColumns?: string[];
}

const RelatedTransactions = ({
  filters,
  excludeColumns = []
}: RelatedTransactionsProps) => {
  const { tableSize } = useSettings();
  const filteredColumns = columns.filter(
    col => !excludeColumns.includes(col.dataIndex as string)
  );

  // const { data, isLoading } = useQuery(
  //   ["items/transactions", { page: 1, filters }],
  //   fetchTransactions
  // );

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
