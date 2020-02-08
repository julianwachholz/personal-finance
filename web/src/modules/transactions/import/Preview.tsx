import { LoadingOutlined } from "@ant-design/icons";
import { Spin, Table } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { getImportConfigPreview, ImportConfig } from "../../../dao/import";
import { mapTransaction, Transaction } from "../../../dao/transactions";
import getGetColumns from "../columns";

interface PreviewProps {
  importConfig: ImportConfig;
  fileId: number;
}

export const Preview = ({ importConfig, fileId }: PreviewProps) => {
  const [t] = useTranslation("transactions");

  const { data, isLoading, isFetching } = useQuery(
    ["import/config/preview", { pk: importConfig.pk, file: fileId }],
    getImportConfigPreview
  );

  return (
    <div>
      <h2>{t("import.preview.title", "Preview")}</h2>
      {isLoading ? (
        <Spin
          indicator={<LoadingOutlined />}
          tip={t("translation:loading", "Loading...")}
        />
      ) : (
        <Table<Transaction>
          showHeader={true}
          dataSource={data?.results ? data.results.map(mapTransaction) : []}
          columns={getGetColumns(t)().filter(c => c.dataIndex != "tags")}
          loading={isLoading || isFetching}
          rowKey="pk"
          pagination={false}
        />
      )}
    </div>
  );
};

export default Preview;
