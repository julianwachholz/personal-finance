import { Button, Icon, Input, Table } from "antd";
import { FilterDropdownProps } from "antd/lib/table";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import Money from "../../components/data/Money";

const { Column } = Table;

interface IFetchAccountsParams {
  page: number;
  ordering?: string;
}

const fetchAccounts = async ({ page, ordering }: IFetchAccountsParams) => {
  let url = `/api/accounts/?page=${page}`;
  if (ordering) {
    url += `&ordering=${ordering}`;
  }
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const getColumnSearchProps = (dataIndex: string) => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters
  }: FilterDropdownProps) => (
    <div style={{ padding: 8 }}>
      <Input placeholder={`Search ${dataIndex}`} />
      <Button icon="search" type="primary">
        Search
      </Button>
    </div>
  ),
  filterIcon: (filtered: boolean) => (
    <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
  )
});

const Accounts: React.FC = () => {
  const [page, setPage] = useState(1);
  const [ordering, setOrdering] = useState();
  const { data, isLoading, error } = useQuery(
    ["Accounts", { page, ordering }],
    fetchAccounts
  );
  if (error) {
    return <h1>Error</h1>;
  }
  return (
    <Table
      dataSource={data && data.results}
      loading={isLoading}
      pagination={{
        position: "both",
        current: page,
        pageSize: 10,
        total: data && data.count
      }}
      rowKey="pk"
      onChange={(pagination, filters, sorter) => {
        setPage(pagination.current || 1);
        setOrdering(
          sorter.order &&
            `${sorter.order === "ascend" ? "" : "-"}${sorter.field}`
        );
      }}
    >
      <Column title="Name" dataIndex="name" {...getColumnSearchProps("name")} />
      <Column title="Institution" dataIndex="institution" />
      <Column
        title="Balance"
        dataIndex="balance"
        align="right"
        sorter
        render={(balance, account: any) => (
          <Money amount={balance} currency={account.balance_currency} />
        )}
      />
      <Column
        render={(_, account: any) => (
          <Link to={`/accounts/${account.pk}`}>Edit</Link>
        )}
      />
    </Table>
  );
};

export default Accounts;
