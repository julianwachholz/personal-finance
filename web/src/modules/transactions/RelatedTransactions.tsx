import { Table } from "antd";
import React from "react";
import { prefetchQuery, useQuery } from "react-query";
import { fetchTransactions, Transaction } from "../../dao/transactions";
import { useSettings } from "../../utils/SettingsProvider";
import columns from "./columns";

interface RelatedTransactionsProps {
  filters: string[];
}

export const prefetchRelatedTx = (filters: string[]) => {
  prefetchQuery(
    ["items/transactions", { page: 1, filters }],
    fetchTransactions,
    { staleTime: 100 }
  );
};

const RelatedTransactions = ({ filters }: RelatedTransactionsProps) => {
  const { tableSize } = useSettings();
  const filteredColumns = columns;

  const { data, isLoading } = useQuery(
    ["items/transactions", { page: 1, filters }],
    fetchTransactions
  );

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
