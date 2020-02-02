import {
  CheckCircleTwoTone,
  LoadingOutlined,
  UploadOutlined
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Col,
  Form,
  Input,
  List,
  Modal,
  Progress,
  Radio,
  Result,
  Row,
  Select,
  Steps,
  Upload
} from "antd";
import { UploadFile } from "antd/lib/upload/interface";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import CategorySelect from "../../components/form/CategorySelect";
import DatePicker from "../../components/form/DatePicker";
import ModelSelect from "../../components/form/ModelSelect";
import { useAccounts } from "../../dao/accounts";
import { getAuthHeaders } from "../../dao/base";
import {
  ColumnMapping,
  ColumnMappingTarget,
  deleteUploadedFile,
  fetchUnmappedValues,
  ImportFile,
  postImportConfig,
  putImportConfig,
  useImportConfig
} from "../../dao/import";
import { usePayees } from "../../dao/payees";

const { Dragger } = Upload;

type File = UploadFile<ImportFile>;

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

const COLUMN_IGNORE = "__ignore__";
const COLUMN_VALUE = "__value__";

export const ImportWizard = ({ visible, onVisible }: ImportWizardProps) => {
  const [t] = useTranslation("transactions");
  const [form] = Form.useForm();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasFiles, setHasFiles] = useState(false);
  const [error, setError] = useState<boolean | string>(false);

  const [importConfigId, setImportConfigId] = useState<number>();
  const { data: importConfig } = useImportConfig(importConfigId, {
    refetchOnWindowFocus: false
  });

  const [headers, setHeaders] = useState<string[]>([]);
  const [mappings, setMappings] = useState<ColumnMapping[]>([]);

  const [createImportConfig] = useMutation(postImportConfig);
  const [updateImportConfig] = useMutation(putImportConfig);
  const [unmappedValues, setUnmappedValues] = useState<any>();
  const [getUnmappedValues] = useMutation(fetchUnmappedValues);

  useEffect(() => {
    if (importConfig?.mappings) {
      setMappings(importConfig.mappings);

      const valuesFromMappings: Record<string, string | ColumnMapping> = {};
      Object.keys(columnNames).forEach(column => {
        const mapping = importConfig.mappings.find(m => m.target === column);
        if (mapping) {
          if (mapping.is_sourced && mapping.source) {
            valuesFromMappings[mapping.target] = mapping.source;
          } else {
            valuesFromMappings[mapping.target] = COLUMN_VALUE;
          }
        } else {
          valuesFromMappings[column] = COLUMN_IGNORE;
        }
      });

      importConfig.mappings.forEach(mapping => {
        valuesFromMappings[`mapping[${mapping.target}]`] = mapping;
      });

      form.setFieldsValue(valuesFromMappings);
    }
    // eslint-disable-next-line
  }, [importConfig]);

  let cancelModal: any;
  const closeModal = async () => {
    const files = form.getFieldValue("files");
    if (files) {
      cancelModal?.update({
        okText: t("import.deleting_files", "Deleting files...")
      });
      await Promise.all(files.map(deleteUploadedFile));
    }
    form.resetFields();
    setError(false);
    setHasFiles(false);
    setStep(0);
    onVisible(false);
  };

  const mapColumns = [
    ["datetime", t("date", "Date")],
    ["account", t("account", "Account")],
    ["amount", t("amount", "Amount")],
    ["payee", t("payee", "Payee")],
    ["category", t("category", "Category")],
    ["text", t("description", "Description")],
    // TODO
    // ["tags", t("tags", "Tags")],
    ["reference", t("reference_number", "Reference Number")]
  ];
  const columnNames = Object.fromEntries(mapColumns);

  return (
    <Modal
      width={960}
      maskClosable={false}
      closable={false}
      visible={visible}
      title={t("import.title", "Import Transactions")}
      keyboard={false}
      footer={null}
    >
      <div className="modal-wizard">
        <Steps current={step}>
          <Steps.Step title={t("import.upload.title", "Upload")} />
          <Steps.Step title={t("import.columns.title", "Map Columns")} />
          <Steps.Step title={t("import.config.title", "Configuration")} />
          <Steps.Step title={t("import.values.title", "Map Values")} />
          <Steps.Step title={t("import.preview.title", "Preview")} />
        </Steps>
        <Form
          form={form}
          className="modal-wizard-content"
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 10 }}
          onValuesChange={changedValues => {
            if ("files" in changedValues) {
              const files = changedValues.files as UploadFile<ImportFile>[];
              const headers = files[0].response?.headers;
              if (headers) {
                setHeaders(headers);
              }
              const matchingConfigs = files[0].response?.matching_configs;
              if (matchingConfigs?.length === 1) {
                // load existing import config
                setImportConfigId(matchingConfigs[0].pk);
              }
            } else {
              Object.keys(changedValues).forEach(key => {
                if (key.startsWith("mapping[")) {
                  console.info(changedValues);
                  const mapping = changedValues[key];
                  const newMappings = mappings.filter(
                    m => m.target !== mapping.target
                  );
                  const index = mapColumns.findIndex(
                    ([c]) => c === mapping.target
                  );
                  newMappings.splice(index, 0, mapping);
                  setMappings(newMappings);
                }
              });
            }
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
                  validator: (rule, files: UploadFile<ImportFile>[]) => {
                    const headers = files[0].response?.headers;
                    if (
                      headers &&
                      files.filter(
                        f =>
                          !f.response ||
                          headers.every((header, i) => headers[i] === header)
                      ).length !== files.length
                    ) {
                      setError(
                        t(
                          "import.upload.files_same_format_required",
                          "Uploaded files must have the same format"
                        ) as string
                      );
                      return Promise.reject("files must have same format");
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
                    setError(false);
                  } catch (e) {}
                }}
                onRemove={deleteUploadedFile}
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
                  {t(
                    "import.upload.files_upload",
                    "Click or drag to upload files"
                  )}
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
          )}
          {step === 1 && (
            <div>
              <h2>{t("import.columns.title", "Map Columns")}</h2>
              {importConfigId && (
                <Alert
                  type="info"
                  showIcon
                  message={t(
                    "import.config_imported",
                    "We imported a previous import configuration! Your changes will be saved for the next time."
                  )}
                />
              )}
              {mapColumns.map(([column, name]) => (
                <Form.Item
                  key={column}
                  name={column}
                  label={name}
                  required={false}
                  extra={
                    column === "reference" &&
                    t(
                      "import.columns.map_reference_help",
                      "A unqiue identifier for a transaction."
                    )
                  }
                  rules={[
                    {
                      required: true,
                      message: t(
                        "import.columns.mapping_required",
                        "Please select a mapping"
                      )
                    }
                  ]}
                >
                  <Select
                    onChange={(value: string) => {
                      const newMappings = mappings.filter(
                        m => m.target !== column
                      );
                      if (value === COLUMN_IGNORE) {
                        setMappings(newMappings);
                        return;
                      }
                      const mapping: ColumnMapping = {
                        target: column as ColumnMappingTarget,
                        is_sourced: value !== COLUMN_VALUE,
                        source: value === COLUMN_VALUE ? undefined : value,
                        options: {}
                      };
                      const index = mapColumns.findIndex(
                        ([c]) => c === mapping.target
                      );
                      newMappings.splice(index, 0, mapping);
                      form.setFieldsValue({
                        [`mapping[${mapping.target}]`]: mapping
                      });
                      setMappings(newMappings);
                    }}
                  >
                    {column !== "amount" && (
                      <Select.OptGroup
                        label={t(
                          "import.columns.mapping_functions",
                          "Functions"
                        )}
                      >
                        <Select.Option value={COLUMN_IGNORE}>
                          {t(
                            "import.columns.mapping_ignore",
                            "Ignore this column"
                          )}
                        </Select.Option>
                        {column !== "reference" && (
                          <Select.Option value={COLUMN_VALUE}>
                            {t(
                              "import.columns.mapping_value",
                              "Supply a fixed value"
                            )}
                          </Select.Option>
                        )}
                      </Select.OptGroup>
                    )}
                    <Select.OptGroup
                      label={t("import.columns.mapping_fields", "Fields")}
                    >
                      {headers.map(header => (
                        <Select.Option key={header} value={header}>
                          {header}
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
              <h2>{t("import.config.title", "Configuration")}</h2>
              {mappings.map(mapping => (
                <Form.Item
                  key={mapping.target}
                  name={`mapping[${mapping.target}]`}
                  label={columnNames[mapping.target]}
                  wrapperCol={{ span: 16 }}
                  getValueFromEvent={value => value}
                >
                  <MappingOptions />
                </Form.Item>
              ))}
            </div>
          )}
          {step === 3 && (
            <div>
              <h2>{t("import.values.title", "Map Values")}</h2>
              {Object.keys(unmappedValues).map(model => (
                <List
                  header={columnNames[model]}
                  dataSource={unmappedValues[model]}
                  renderItem={(item: string) => <List.Item>{item}</List.Item>}
                />
              ))}
            </div>
          )}
          {step === 4 && (
            <div>
              <h2>{t("import.preview.title", "Preview")}</h2>
              <ul>
                <li>Preview</li>
                <li>Preview</li>
                <li>Preview</li>
                <li>Preview</li>
              </ul>
            </div>
          )}
          {step === 5 && (
            <Result
              title={t("import.importing.title")}
              icon={<LoadingOutlined />}
              extra={<Progress status="active" percent={17} />}
            />
          )}
          {step === 6 && (
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
            {step > 0 && step < 5 && (
              <Button type="primary" onClick={() => setStep(step - 1)}>
                {t("import.wizard.back", "Back")}
              </Button>
            )}
            {step < 5 && (
              <Button
                type="link"
                onClick={() => {
                  if (hasFiles || step > 0) {
                    cancelModal = Modal.confirm({
                      title: t(
                        "import.cancel.confirm",
                        "Cancel import process?"
                      ),
                      content: t(
                        "import.cancel.message",
                        "Your uploaded files will be deleted without being imported."
                      ),
                      style: { marginTop: 100 },
                      okText: t("import.cancel.button", "Cancel Import"),
                      okButtonProps: { type: "danger" },
                      cancelText: t(
                        "import.cancel.continue",
                        "Continue Import"
                      ),
                      onOk: closeModal
                    });
                  } else {
                    closeModal();
                  }
                }}
              >
                {t("import.cancel.button", "Cancel Import")}
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
                    if (step === 2) {
                      // save import config
                      setLoading(true);
                      let pk = importConfigId;
                      if (importConfig) {
                        await updateImportConfig(
                          {
                            pk: importConfigId,
                            file_type: "text/csv",
                            mappings
                          } as any,
                          {
                            updateQuery: [
                              "item/import/config",
                              { pk: importConfigId }
                            ]
                          }
                        );
                      } else {
                        const newConfig = await createImportConfig({
                          file_type: "text/csv",
                          mappings
                        } as any);
                        pk = newConfig.pk;
                        setImportConfigId(pk);
                      }
                      const _unmappedValues = await getUnmappedValues({
                        pk: pk!,
                        file: 207
                      });
                      setUnmappedValues(_unmappedValues);
                      setLoading(false);
                    }
                    setStep(step + 1);
                  } catch (errors) {
                    console.info(errors);
                  }
                }}
                loading={loading}
                disabled={!hasFiles || !!error}
              >
                {step === 4
                  ? t("import.wizard.import_button", "Import now!")
                  : t("import.wizard.next", "Next")}
              </Button>
            )}
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

interface MappingOptionsProps {
  value?: ColumnMapping;
  onChange?: (value: ColumnMapping) => void;
}

const MappingOptions = ({ value, ...props }: MappingOptionsProps) => {
  if (value?.is_sourced) {
    return <ColumnMappingOptions value={value} {...props} />;
  } else {
    return <ColumnMappingValue value={value} {...props} />;
  }
};

const ColumnMappingOptions = ({ value, onChange }: MappingOptionsProps) => {
  const [t] = useTranslation("transactions");

  switch (value?.target) {
    case "datetime":
      return (
        <Row gutter={8}>
          <Col span={9}>
            <Radio.Group
              name="dayfirst"
              buttonStyle="solid"
              value={value.options?.dayfirst ?? true}
              onChange={e => {
                onChange?.({
                  ...value,
                  options: {
                    ...value.options,
                    dayfirst: e.target.value
                  }
                });
              }}
            >
              <Radio.Button value={true}>Day first</Radio.Button>
              <Radio.Button value={false}>Month first</Radio.Button>
            </Radio.Group>
          </Col>
          <Col span={9}>
            <Radio.Group
              name="yearfirst"
              buttonStyle="solid"
              value={value.options?.yearfirst ?? false}
              onChange={e => {
                onChange?.({
                  ...value,
                  options: {
                    ...value.options,
                    yearfirst: e.target.value
                  }
                });
              }}
            >
              <Radio.Button value={true}>Year first</Radio.Button>
              <Radio.Button value={false}>Year last</Radio.Button>
            </Radio.Group>
          </Col>
        </Row>
      );
    case "amount":
      return (
        <>
          <label>Decimal Separator: </label>
          <Radio.Group
            buttonStyle="solid"
            value={value.options?.decimal_separator ?? "."}
            onChange={e => {
              onChange?.({
                ...value,
                options: {
                  ...value.options,
                  decimal_separator: e.target.value
                }
              });
            }}
          >
            <Radio.Button value=".">.</Radio.Button>
            <Radio.Button value=",">,</Radio.Button>
          </Radio.Group>
        </>
      );
    // TODO
    // case "tags":
    //   return <span>Ready</span>;
    default:
      return (
        <>
          {t("import.columns.mapping_ready", "Ready")}{" "}
          <CheckCircleTwoTone twoToneColor="#52c41a" />
        </>
      );
  }
};

const ColumnMappingValue = ({ value, onChange }: MappingOptionsProps) => {
  switch (value?.target) {
    case "datetime":
      return (
        <DatePicker
          value={value.options?.value}
          onChange={date => {
            onChange!({
              ...value,
              options: {
                ...value.options,
                value: date as any
              }
            });
          }}
        />
      );
    case "account":
      return (
        <ModelSelect
          useItems={useAccounts}
          style={{ width: 200 }}
          value={value.options?.value && (value.options as any)}
          onChange={(account: any) => {
            onChange!({
              ...value,
              options: {
                ...value.options,
                ...account
              }
            });
          }}
        />
      );
    case "payee":
      return (
        <ModelSelect
          useItems={usePayees}
          style={{ width: 200 }}
          value={value.options?.value && (value.options as any)}
          onChange={(payee: any) => {
            onChange!({
              ...value,
              options: {
                ...value.options,
                ...payee
              }
            });
          }}
        />
      );
    case "category":
      return (
        <CategorySelect
          style={{ width: 200 }}
          value={value.options?.value && (value.options as any)}
          onChange={(category: any) => {
            onChange!({
              ...value,
              options: {
                ...value.options,
                ...category
              }
            });
          }}
        />
      );
    case "text":
      return (
        <Input
          style={{ width: 200 }}
          value={value.options?.value}
          onChange={e => {
            onChange!({
              ...value,
              options: {
                ...value.options,
                value: e.target.value
              }
            });
          }}
        />
      );
    default:
      // this should never happen
      return <>error</>;
  }
};

export default ImportWizard;
