import { Button, Icon, Input, Table } from "antd";
import { FilterDropdownProps } from "antd/lib/table";
import React, { ReactText, useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import Money from "../../components/data/Money";

const { Column } = Table;

interface IFetchAccountsParams {
  page: number;
  ordering?: string;
  search?: string;
}

const fetchAccounts = async ({
  page,
  ordering,
  search
}: IFetchAccountsParams) => {
  let url = `/api/accounts/?page=${page}`;
  if (ordering) {
    url += `&ordering=${ordering}`;
  }
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const getColumnSearchProps = (
  dataIndex: string,
  setValue: (value: string) => void
) => {
  let searchInput: Input | null;

  const handleSearch = (selectedKeys: ReactText[] | string[], confirm: any) => {
    confirm();
    setValue(selectedKeys[0] as string);
  };
  const handleReset = (clearFilters: (selectedKeys: string[]) => void) => {
    clearFilters([]);
    setValue("");
  };

  return {
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }: Required<FilterDropdownProps>) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => (searchInput = node)}
          placeholder={`Search accounts`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          onClick={() => handleSearch(selectedKeys, confirm)}
          icon="search"
          type="primary"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilterDropdownVisibleChange: (visible: boolean) => {
      if (visible) {
        setTimeout(() => searchInput!.select());
      }
    }
  };
};

const Accounts: React.FC = () => {
  const [page, setPage] = useState(1);
  const [ordering, setOrdering] = useState();
  const [search, setSearch] = useState();

  const { data, isLoading, error } = useQuery(
    ["Accounts", { page, ordering, search }],
    fetchAccounts
  );
  if (error) {
    return <h1>Error</h1>;
  }
  return (
    <>
      <div style={{ float: "left" }}>
        <Input placeholder="Search" />
      </div>
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
        <Column
          title="Name"
          dataIndex="name"
          {...getColumnSearchProps("name", setSearch)}
        />
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
    </>
  );
};

export default Accounts;
