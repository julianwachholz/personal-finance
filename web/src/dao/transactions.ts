import {
  makeItemsAction,
  makePostItem,
  makePutItem,
  makeUseItems,
  ModelWithLabel
} from "./base";

export interface Transaction {
  pk: number;
  account: ModelWithLabel;
  category?: ModelWithLabel;
  payee?: ModelWithLabel;
  tags: ModelWithLabel[];

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

export const bulkDeleteTransactions = makeItemsAction(
  "transactions",
  "bulk_delete",
  "DELETE"
);
