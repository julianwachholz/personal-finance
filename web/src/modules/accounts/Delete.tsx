import { Button, List, message, Spin, Typography } from "antd";
import React from "react";
import { BrowserView, isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { Link, RouteComponentProps } from "react-router-dom";
import { deleteAccount, useAccount } from "../../dao/accounts";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";

const { Paragraph: P } = Typography;

interface DeleteParams {
  pk: string;
}

const AccountDelete = ({
  match,
  history
}: RouteComponentProps<DeleteParams>) => {
  const [t] = useTranslation("accounts");
  const { data: account } = useAccount(match.params.pk);
  const relatedItems = [
    "Transaction #54342",
    "Transaction #56907",
    "Transaction #06812",
    "Transaction #87514"
  ];

  const [mutate] = useMutation(deleteAccount, {
    refetchQueries: ["items/accounts"]
  });

  useTitle(
    account &&
      t("accounts:delete", "Delete {{ label }}", { label: account.label })
  );
  return account ? (
    <BaseModule
      title={t("accounts:delete", "Delete {{ label }}", {
        label: account.label
      })}
      onLeftClick={() => {
        history.go(-3);
      }}
    >
      <P>
        {t(
          "accounts:delete_confirm",
          'Are you sure you want to delete the Account "{{ label }}"?',
          { label: account.label }
        )}
      </P>
      <P>
        {t(
          "accounts:delete_related_warning",
          "The following associated records will also be deleted:"
        )}
      </P>
      <List
        dataSource={relatedItems}
        renderItem={item => <List.Item>{item}</List.Item>}
      />
      <Button
        type="danger"
        onClick={async () => {
          await mutate(account);
          message.info(
            t("accounts:deleted", 'Account "{{ label }}" deleted', {
              label: account.label
            })
          );
          history.push(`/accounts`);
        }}
        block={isMobile}
        size={isMobile ? "large" : "middle"}
      >
        {t("accounts:delete_account", "Delete Account")}
      </Button>
      <BrowserView>
        <Link to={`/accounts/${account.pk}`}>
          <Button>{t("translation:cancel", "Cancel")}</Button>
        </Link>
      </BrowserView>
    </BaseModule>
  ) : (
    <Spin />
  );
};

export default AccountDelete;
