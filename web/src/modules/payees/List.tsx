import { DeleteFilled, FormOutlined, ShopOutlined } from "@ant-design/icons";
import { List, SwipeAction } from "antd-mobile";
import { History } from "history";
import { TFunction } from "i18next";
import React from "react";
import { useTranslation } from "react-i18next";
import { MutateFunction, useMutation } from "react-query";
import { RouteComponentProps } from "react-router-dom";
import Fab from "../../components/button/Fab";
import { UseItemsPaginated } from "../../dao/base";
import { deletePayee, Payee, usePayees } from "../../dao/payees";
import { COLOR_DANGER, COLOR_PRIMARY } from "../../utils/constants";
import BaseList from "../base/BaseList";
import { confirmDeletePayee } from "./delete";

const renderPayee = (
  history: History,
  doDelete: MutateFunction<void, Payee>,
  t: TFunction,
  payee: Payee
) => {
  return (
    <SwipeAction
      key={payee.pk}
      left={
        [
          {
            text: <DeleteFilled />,
            style: { width: 48, backgroundColor: COLOR_DANGER, color: "#fff" },
            onPress() {
              confirmDeletePayee(payee, doDelete, t);
            }
          }
        ] as any
      }
      right={
        [
          {
            text: <FormOutlined />,
            style: { width: 48, backgroundColor: COLOR_PRIMARY, color: "#fff" },
            onPress() {
              history.push(`/settings/payees/${payee.pk}/edit`, { back: -1 });
            }
          }
        ] as any
      }
    >
      <List.Item
        extra={
          payee.type === "business"
            ? t("payees:type_business", "Business")
            : t("payees:type_person", "Person")
        }
        onClick={() => {
          history.push(`/settings/payees/${payee.pk}`);
        }}
      >
        {payee.label}
        {payee.default_category && (
          <List.Item.Brief>{payee.default_category?.label}</List.Item.Brief>
        )}
      </List.Item>
    </SwipeAction>
  );
};

const PayeeList = ({ history }: RouteComponentProps) => {
  const [t] = useTranslation("payees");
  const [doDelete] = useMutation(deletePayee, {
    refetchQueries: ["items/payees"]
  });

  return (
    <BaseList
      itemName={t("payees:payee", "Payee")}
      itemNamePlural={t("payees:payee_plural", "Payees")}
      useItems={usePayees as UseItemsPaginated<Payee>}
      renderRow={renderPayee.bind(null, history, doDelete, t)}
      headerProps={{
        onLeftClick() {
          history.go(-1);
        }
      }}
      fab={
        <Fab
          icon={<ShopOutlined />}
          onClick={() => {
            history.push(`/settings/payees/create`);
          }}
        />
      }
    />
  );
};

export default PayeeList;
