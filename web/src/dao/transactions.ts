import {
  makeDeleteItem,
  makeItemsAction,
  makePostItem,
  makePutItem,
  makeUseItems,
  ModelWithLabel
} from "./base";

interface HasIcon {
  icon?: string;
}

interface HasName {
  name: string;
}

interface HasColor {
  color?: string;
}

export interface Transaction {
  pk: number;
  account: ModelWithLabel & HasIcon;
  category?: ModelWithLabel & HasIcon & HasName;
  payee?: ModelWithLabel;
  tags: (ModelWithLabel & HasColor)[];

  datetime: Date;

  amount: string;
  amount_currency: string;

  readonly is_transfer: boolean;
  readonly is_initial: boolean;

  text: string;
  reference: string;

  set_account: number;
  set_category: number | null;
  set_payee: number | null;
  set_tags: number[];

  readonly label: string;

  // Only used in frontend
  readonly type: "expense" | "income";
}

const mapTx = (tx: Transaction) => {
  tx.datetime = new Date(tx.datetime);
  return tx;
};

export const [useTransactions, prefetchTransactions] = makeUseItems<
  Transaction
>("transactions", mapTx);

export const postTransaction = makePostItem<Transaction>("transactions");

export const putTransaction = makePutItem<Transaction>("transactions");

export const deleteTransaction = makeDeleteItem<Transaction>("transactions");

export const bulkDeleteTransactions = makeItemsAction(
  "transactions",
  "bulk_delete",
  "DELETE"
);
