import { LoadingOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Progress,
  Result,
  Row,
  Select,
  Steps,
  Upload
} from "antd";
import { UploadFile } from "antd/lib/upload/interface";
import React, { useState } from "react";
import { authFetch, getAuthHeaders } from "../../dao/base";

const { Dragger } = Upload;

type File = UploadFile<UploadFileResponse>;

const normalizeFiles = (e: File[] | { fileList: File[] }) => {
  if (Array.isArray(e)) {
    return e.filter(f => f.status !== "removed");
  }
  return e.fileList.filter(f => f.status !== "removed");
};

interface ImportWizardProps {
  visible: boolean;
  onVisible: (visible: boolean) => void;
}

interface UploadFileResponse {
  pk: number;
  label: string;
  type: string;
  datetime: string;
  headers: string[];
}

type ColumnMappingTarget =
  | "datetime"
  | "account"
  | "amount"
  | "category"
  | "text"
  | "payee"
  | "tags"
  | "reference";

interface ColumnMapping {
  target: ColumnMappingTarget;
  is_sourced: boolean;
  source?: string;
  options: any;
}

const deleteUploadedFile = async (file: UploadFile) => {
  await authFetch(`/api/wizard/import/${file.response.pk}/`, {
    method: "DELETE"
  });
};

export const ImportWizard = ({ visible, onVisible }: ImportWizardProps) => {
  const [form] = Form.useForm();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasFiles, setHasFiles] = useState(false);
  const [hasError, setHasError] = useState<boolean | string>(false);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mappings, setMappings] = useState<ColumnMapping[]>([]);

  let cancelModal: any;
  const closeModal = async () => {
    const files = form.getFieldValue("files");
    if (files) {
      cancelModal?.update({
        okText: "Deleting files..."
      });
      await Promise.all(files.map(deleteUploadedFile));
    }
    form.resetFields();
    setHasError(false);
    setHasFiles(false);
    setStep(0);
    onVisible(false);
  };

  const mapColumns = [
    ["datetime", "Date and Time"],
    ["amount", "Amount"],
    ["account", "Account"],
    ["category", "Category"],
    ["payee", "Payee"],
    ["tags", "Tags"],
    ["text", "Text"],
    ["reference", "Reference Number"]
  ];
  const columnNames = Object.fromEntries(mapColumns);

  return (
    <Modal
      width={800}
      maskClosable={false}
      closable={false}
      visible={visible}
      title="Import Transactions"
      keyboard={false}
      footer={null}
    >
      <div className="modal-wizard">
        <Steps current={step}>
          <Steps.Step title="Upload" />
          <Steps.Step title="Map Columns" />
          <Steps.Step title="Configuration" />
          <Steps.Step title="Import" />
        </Steps>
        <Form
          form={form}
          className="modal-wizard-content"
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 10 }}
          onValuesChange={(newValues, values) => {
            console.info("new values", values);
          }}
        >
          {step === 0 && (
            <Form.Item
              name="files"
              valuePropName="fileList"
              getValueFromEvent={normalizeFiles}
              noStyle
              hasFeedback
              rules={[
                {
                  validator: (
                    rule,
                    files: UploadFile<UploadFileResponse>[]
                  ) => {
                    const headers = files[0].response?.headers;
                    if (
                      headers &&
                      files.filter(
                        f =>
                          !f.response ||
                          f.response.headers.every(
                            (header, i) => headers[i] === header
                          )
                      ).length !== files.length
                    ) {
                      setHasError("Uploaded files must have the same format");
                      return Promise.reject(
                        "Uploaded files must have the same format"
                      );
                    }
                    if (headers) {
                      setHeaders(headers);
                      const ignoreValues = Object.fromEntries(
                        headers.map((h, i) => [`mapping[${i}]`, "__ignore__"])
                      );
                      form.setFieldsValue(ignoreValues);
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
                onChange={async e => {
                  setLoading(
                    e.fileList.filter(f => f.status === "done").length !==
                      e.fileList.length
                  );
                  setHasFiles(e.fileList.length > 0);
                  try {
                    await form.validateFields();
                    setHasError(false);
                  } catch (e) {}
                }}
                onRemove={deleteUploadedFile}
                action={`/api/wizard/import/`}
                headers={getAuthHeaders()}
                showUploadList={{
                  showDownloadIcon: false
                }}
              >
                <p className="ant-upload-drag-icon">
                  <UploadOutlined />
                </p>
                <p className="ant-upload-text">Click or drag to upload files</p>
                <p className={`ant-upload-${hasError ? "error" : "hint"}`}>
                  {hasError
                    ? "Uploaded files must have same format."
                    : "You may choose multiple CSV files"}
                </p>
              </Dragger>
            </Form.Item>
          )}
          {step === 1 && (
            <div>
              <h2>Map Columns</h2>
              {headers.map((header, i) => (
                <Form.Item
                  key={header}
                  label={header}
                  name={`mapping[${i}]`}
                  required={false}
                  rules={[{ required: true, message: "Please select a field" }]}
                >
                  <Select
                    onChange={value => {
                      if (value === "__ignore__") {
                        return;
                      }
                      const newMappings = [
                        ...mappings.filter(m => m.target !== value),
                        {
                          target: value,
                          is_sourced: true,
                          source: header,
                          options: {}
                        } as ColumnMapping
                      ];
                      setMappings(newMappings);
                    }}
                    defaultActiveFirstOption
                  >
                    <Select.OptGroup label="Functions">
                      <Select.Option value="__ignore__">
                        Ignore this column
                      </Select.Option>
                    </Select.OptGroup>
                    <Select.OptGroup label="Fields">
                      {mapColumns.map(([value, label]) => (
                        <Select.Option key={value} value={value}>
                          {label}
                        </Select.Option>
                      ))}
                    </Select.OptGroup>
                  </Select>
                </Form.Item>
              ))}
            </div>
          )}
          {step === 2 && (
            <div>
              <h2>Configuration</h2>
              {mappings.map(mapping => (
                <Form.Item
                  key={mapping.target}
                  label={columnNames[mapping.target]}
                  extra={`Extract from column "${mapping.source}"`}
                >
                  <Input />
                </Form.Item>
              ))}
            </div>
          )}
          {step === 3 && (
            <Result
              title="Importing..."
              icon={<LoadingOutlined />}
              extra={<Progress status="active" percent={17} />}
            />
          )}
          {step === 4 && (
            <Result
              status="success"
              title="Done!"
              subTitle="Successfully imported 310 Transactions."
              extra={
                <Button key="done" type="primary" onClick={() => setStep(0)}>
                  Finish
                </Button>
              }
            />
          )}
        </Form>
        <Row>
          <Col span={12}>
            {step > 0 && step < 3 && (
              <Button type="primary" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            {step < 3 && (
              <Button
                type="link"
                onClick={() => {
                  if (hasFiles || step > 0) {
                    cancelModal = Modal.confirm({
                      title: "Cancel import process?",
                      content: `You will lose all settings and progress.${
                        hasFiles
                          ? " Your uploaded files will be deleted without being imported."
                          : ""
                      }`,
                      style: { marginTop: 100 },
                      okText: "Cancel Import",
                      okButtonProps: { type: "danger" },
                      cancelText: "Continue Import",
                      onOk: closeModal
                    });
                  } else {
                    closeModal();
                  }
                }}
              >
                Cancel
              </Button>
            )}
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            {step < 3 && (
              <Button
                type="primary"
                onClick={async () => {
                  try {
                    await form.validateFields();
                    setStep(step + 1);
                  } catch (errors) {
                    console.info(errors);
                  }
                }}
                loading={loading}
                disabled={!hasFiles || !!hasError}
              >
                {step === 2 ? "Import" : "Next"}
              </Button>
            )}
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default ImportWizard;
