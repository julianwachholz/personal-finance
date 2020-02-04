import { LoadingOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  List,
  Modal,
  Progress,
  Result,
  Row,
  Steps
} from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import {
  ColumnMapping,
  deleteUploadedFile,
  fetchUnmappedValues,
  postImportConfig,
  putImportConfig,
  useImportConfig
} from "../../../dao/import";
import { postPayee, usePayees } from "../../../dao/payees";
import MapColumns, { COLUMN_IGNORE, COLUMN_VALUE } from "./MapColumns";
import MappingOptions from "./MappingOptions";
import MapValueForm from "./MapValueForm";
import UploadStep, { UploadStepState } from "./Upload";

interface ImportWizardProps {
  visible: boolean;
  onVisible: (visible: boolean) => void;
}

interface ImportWizardState {
  fileIds?: number[];
  headers?: string[];
  importConfigId?: number;
}

export const ImportWizard = ({ visible, onVisible }: ImportWizardProps) => {
  const [t] = useTranslation("transactions");
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<UploadStepState>({});

  const [form] = Form.useForm();

  const [importConfigId, setImportConfigId] = useState<number>();
  const { data: importConfig } = useImportConfig(state.importConfigId, {
    refetchOnWindowFocus: false
  });

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
    if (state.fileIds?.length) {
      cancelModal?.update({
        okText: t("import.deleting_files", "Deleting files...")
      });
      await Promise.all(state.fileIds.map(deleteUploadedFile));
    }
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

  const onUploadChange = ({
    loading,
    ...newState
  }: UploadStepState & { loading: boolean }) => {
    console.log("UploadStep onChange:", loading, newState);
    setLoading(loading);
    setState({ ...state, ...newState });
  };

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
        <div
          className="modal-wizard-content"
          // layout="horizontal"
          // labelCol={{ span: 6 }}
          // wrapperCol={{ span: 10 }}
          // onValuesChange={changedValues => {
          //   Object.keys(changedValues).forEach(key => {
          //     if (key.startsWith("mapping[")) {
          //       console.info(changedValues);
          //       const mapping = changedValues[key];
          //       const newMappings = mappings.filter(
          //         m => m.target !== mapping.target
          //       );
          //       const index = mapColumns.findIndex(
          //         ([c]) => c === mapping.target
          //       );
          //       newMappings.splice(index, 0, mapping);
          //       setMappings(newMappings);
          //     }
          //   });
          // }}
        >
          {step === 0 && (
            <UploadStep files={state.files} onChange={onUploadChange} />
          )}
          {step === 1 && (
            <MapColumns
              headers={state.headers!}
              importConfigId={importConfigId}
            />
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
                  header={<h3>{columnNames[model]}</h3>}
                  pagination={{
                    pageSize: 6
                  }}
                  dataSource={unmappedValues[model]}
                  renderItem={(item: string, i) => (
                    <List.Item key={i} className="list-item-row">
                      <MapValueForm
                        item={item}
                        useItems={usePayees}
                        createItem={postPayee}
                        withCategory
                      />
                    </List.Item>
                  )}
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
        </div>
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
                  if (state.fileIds?.length || step > 0) {
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
                disabled={!(state.fileIds && state.fileIds.length > 0)}
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

export default ImportWizard;
