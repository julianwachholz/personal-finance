import { Table } from "antd";
import React, { useState } from "react";
import { useQuery } from "react-query";

const { Column } = Table;

const fetchCategories = async ({ page }: { page: number }) => {
  const response = await fetch(`/api/categories/?page=${page}`);
  const data = await response.json();
  return data;
};

const Categories: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useQuery(
    ["Categories", { page }],
    fetchCategories
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
      onChange={pagination => {
        setPage(pagination.current || 1);
      }}
    >
      <Column title="Name" dataIndex="name" />
    </Table>
  );
};

export default Categories;
