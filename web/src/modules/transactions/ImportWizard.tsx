import { LoadingOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Modal,
  Progress,
  Result,
  Row,
  Steps,
  Upload
} from "antd";
import { UploadFile } from "antd/lib/upload/interface";
import React, { useState } from "react";
import { authFetch, getAuthHeaders } from "../../dao/base";
import "./ImportWizard.scss";

const { Dragger } = Upload;

const normalizeFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

interface ImportWizardProps {
  visible: boolean;
  onVisible: (visible: boolean) => void;
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

  let cancelModal: any;
  const closeModal = async () => {
    const files = form.getFieldValue("files");
    if (files) {
      cancelModal?.update({
        okText: "Deleting files..."
      });
      await Promise.all(files.map(deleteUploadedFile));
    }
    setStep(0);
    setHasFiles(false);
    form.resetFields();
    onVisible(false);
  };

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
      <div className="import-wizard">
        <Steps current={step}>
          <Steps.Step title="Upload" />
          <Steps.Step title="Configuration" />
          <Steps.Step title="Mapping" />
          <Steps.Step title="Import" />
        </Steps>
        <Form form={form} className="import-wizard-content">
          {step === 0 && (
            <Form.Item
              name="files"
              valuePropName="fileList"
              getValueFromEvent={normalizeFile}
              noStyle
            >
              <Dragger
                name="file"
                accept=".csv"
                multiple
                onChange={e => {
                  setLoading(
                    e.fileList.filter(f => f.status === "done").length !==
                      e.fileList.length
                  );
                  setHasFiles(e.fileList.length > 0);
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
                <p className="ant-upload-hint">
                  You may choose multiple CSV files.
                </p>
              </Dragger>
            </Form.Item>
          )}
          {step === 1 && <Result title="Configuration" />}
          {step === 2 && <Result title="Mapping" />}
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
                onClick={() => setStep(step + 1)}
                loading={loading}
                disabled={!hasFiles}
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
