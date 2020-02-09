import { Button, Col, Modal, Result, Row, Steps } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { refetchQuery, useMutation } from "react-query";
import {
  bulkPostValueMapping,
  deleteUploadedFile,
  ImportConfig,
  postImportConfig,
  putImportConfig,
  useImportConfig,
  ValueMapping
} from "../../../dao/import";
import DoImport from "./DoImport";
import MapColumns from "./MapColumns";
import MappingOptions from "./MappingOptions";
import MapValues, { ImportValueMappings } from "./MapValues";
import Preview from "./Preview";
import UploadFiles, { UploadFilesState } from "./Upload";

interface ImportWizardProps {
  visible: boolean;
  onVisible: (visible: boolean) => void;
}

export const ImportWizard = ({ visible, onVisible }: ImportWizardProps) => {
  const [t] = useTranslation("transactions");
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Upload files
  const [uploadState, setUploadState] = useState<UploadFilesState>({});

  // Load existing import config or create new one
  const { data: loadedImportConfig } = useImportConfig(
    uploadState.importConfigId,
    {
      refetchOnWindowFocus: false
    }
  );
  const [importConfig, setImportConfig] = useState<ImportConfig | null>(null);
  const [createImportConfig] = useMutation(postImportConfig);
  const [updateImportConfig] = useMutation(putImportConfig);

  // Collect value mappings
  const [valueMappings, setValueMappings] = useState<ImportValueMappings>();

  // Finish with total count
  const [count, setCount] = useState(0);

  useEffect(() => {
    setImportConfig(loadedImportConfig);
  }, [loadedImportConfig]);

  let cancelModal: any;
  const closeModal = async () => {
    if (uploadState.fileIds?.length) {
      cancelModal?.update({
        okText: t("import.deleting_files", "Deleting files...")
      });
      await Promise.all(uploadState.fileIds.map(deleteUploadedFile));
    }
    onVisible(false);
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
        <div className="modal-wizard-content">
          {step === 0 && (
            <UploadFiles
              files={uploadState.files}
              onChange={state => {
                setLoading(!!state.loading);
                setUploadState(state);
              }}
            />
          )}
          {step === 1 && (
            <MapColumns
              headers={uploadState.headers!}
              importConfig={importConfig}
              onChange={setImportConfig}
            />
          )}
          {step === 2 && (
            <MappingOptions
              importConfig={importConfig!}
              onChange={setImportConfig}
            />
          )}
          {step === 3 && (
            <MapValues
              fileIds={uploadState.fileIds!}
              importConfig={importConfig!}
              valueMappings={valueMappings}
              onChange={setValueMappings}
            />
          )}
          {step === 4 && (
            <Preview
              importConfig={importConfig!}
              fileId={uploadState.fileIds![0]}
            />
          )}
          {step === 5 && (
            <DoImport
              importConfig={importConfig!}
              fileIds={uploadState.fileIds!}
              onFinish={count => {
                setStep(step + 1);
                setCount(count);
              }}
            />
          )}
          {step === 6 && (
            <Result
              status="success"
              title="Done!"
              subTitle={t(
                "import.finish.subtitle",
                "Successfully imported {{ count }} transactions.",
                { count }
              )}
              extra={
                <Button
                  key="done"
                  type="primary"
                  onClick={() => {
                    refetchQuery("items/transactions");
                    closeModal();
                  }}
                >
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
                  if (uploadState.fileIds?.length || step > 0) {
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
            {step < 5 && (
              <Button
                type="primary"
                onClick={async () => {
                  if (step === 2) {
                    // save import config
                    setLoading(true);
                    if (importConfig!.pk) {
                      await updateImportConfig(importConfig!, {
                        updateQuery: [
                          "item/import/config",
                          { pk: uploadState.importConfigId }
                        ]
                      });
                    } else {
                      const newImportConfig = await createImportConfig(
                        importConfig!
                      );
                      setImportConfig(newImportConfig);
                    }
                    setLoading(false);
                  }
                  if (step === 3 && valueMappings) {
                    // save value mappings
                    setLoading(true);
                    await Promise.all(
                      Object.values(valueMappings).map(mappings =>
                        bulkPostValueMapping(
                          mappings!
                            .filter(m => !!m.target)
                            .map(
                              mapping =>
                                ({
                                  content_type: mapping.content_type,
                                  value: mapping.value,
                                  object_id: mapping.target!.value
                                } as ValueMapping)
                            )
                        )
                      )
                    );
                    setLoading(false);
                  }
                  setStep(step + 1);
                }}
                loading={loading}
                disabled={!uploadState.isValid}
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
