import { LoadingOutlined } from "@ant-design/icons";
import { Progress, Result } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ImportConfig, importFile } from "../../../dao/import";

interface DoImportProps {
  importConfig: ImportConfig;
  fileIds: number[];
  onFinish: (count: number) => void;
}

export const DoImport = ({
  importConfig,
  fileIds,
  onFinish
}: DoImportProps) => {
  const [t] = useTranslation("transactions");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    (async () => {
      let total = 0;

      for (let i = 0; i < fileIds.length; i++) {
        const { count } = await importFile({
          pk: importConfig.pk,
          file: fileIds[i]
        });
        total += count;
        setProgress(Math.round(((i + 1) / fileIds.length) * 100));
      }
      onFinish(total);
    })();
    // eslint-disable-next-line
  }, []);

  return (
    <Result
      title={t("import.importing.title", "Importing...")}
      icon={<LoadingOutlined />}
      extra={
        fileIds.length > 1 && <Progress status="active" percent={progress} />
      }
    />
  );
};

export default DoImport;
