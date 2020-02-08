import React from "react";
import { useTranslation } from "react-i18next";

export const COLUMNS = [
  "datetime",
  "account",
  "amount",
  "payee",
  "category",
  "text",
  "reference"
];

interface ColumnNameProps {
  name: string;
}

const ColumnName = ({ name }: ColumnNameProps) => {
  const [t] = useTranslation("transactions");

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

  return <span>{columnNames[name]}</span>;
};

export default ColumnName;
