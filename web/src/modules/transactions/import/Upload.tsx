import { UploadOutlined } from "@ant-design/icons";
import { Form, Upload } from "antd";
import { UploadFile } from "antd/lib/upload/interface";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { getAuthHeaders } from "../../../dao/base";
import { deleteUploadedFile, ImportFile } from "../../../dao/import";

const { Dragger } = Upload;

export type File = UploadFile<ImportFile>;

const normalizeFiles = (e: File[] | { fileList: File[] }) => {
  if (Array.isArray(e)) {
    return e.filter(f => f.status !== "removed");
  }
  return e.fileList.filter(f => f.status !== "removed");
};

interface UploadStepProps {
  onChange: (values: UploadStepState) => void;
}

export interface UploadStepState {
  fileIds?: number[];
  headers?: string[];
  importConfigId?: number;

  loading: boolean;
}

const UploadStep = ({ onChange }: UploadStepProps) => {
  const [t] = useTranslation("transactions");
  const [form] = Form.useForm();
  const [error, setError] = useState<string>();
  const [files, setFiles] = useState<File[]>();

  return (
    <Form
      form={form}
      onValuesChange={changedValues => {
        if ("files" in changedValues) {
          const files = changedValues.files as File[];
          setFiles(files);

          const loading = !files.every(f => f.status === "done");

          if (files.length === 0) {
            console.info("no more files");
            onChange({
              loading,
              fileIds: [],
              headers: undefined,
              importConfigId: undefined
            });
            return;
          }

          const headers = files?.[0].response?.headers;
          const matchingConfigs = files?.[0].response?.matching_configs;
          const importConfigId =
            matchingConfigs?.length === 1 ? matchingConfigs[0].pk : undefined;

          onChange({
            loading,
            headers,
            importConfigId,
            fileIds: files.filter(f => f.response).map(f => f.response!.pk)
          });
        }
      }}
    >
      <Form.Item
        name="files"
        valuePropName="fileList"
        getValueFromEvent={normalizeFiles}
        noStyle
        hasFeedback
        rules={[
          {
            validator: (rule, files: File[]) => {
              if (files.length) {
                const headers = files[0].response?.headers;
                if (
                  headers &&
                  files.every(f => f.response) &&
                  !files.every(f =>
                    f.response?.headers?.every((h, i) => headers[i] === h)
                  )
                ) {
                  setError(
                    t(
                      "import.upload.files_same_format_required",
                      "Uploaded files must have the same format"
                    ) as string
                  );
                  return Promise.reject("files must have same format");
                } else {
                  setError(undefined);
                }
              }
              return Promise.resolve();
            }
          }
        ]}
      >
        <Dragger
          name="file"
          accept=".csv"
          multiple
          onRemove={async file => await deleteUploadedFile(file.response.pk)}
          action={`/api/import/file/`}
          headers={getAuthHeaders()}
          showUploadList={{
            showDownloadIcon: false
          }}
        >
          <p className="ant-upload-drag-icon">
            <UploadOutlined />
          </p>
          <p className="ant-upload-text">
            {t("import.upload.files_upload", "Click or drag to upload files")}
          </p>
          <p className={`ant-upload-${error ? "error" : "hint"}`}>
            {error ||
              t(
                "import.upload.files_hint",
                "You may choose multiple CSV files"
              )}
          </p>
        </Dragger>
      </Form.Item>
    </Form>
  );
};

export default UploadStep;
