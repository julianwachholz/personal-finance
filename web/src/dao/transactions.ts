import {
  makeDeleteItem,
  makeItemsAction,
  makePostItem,
  makePutItem,
  makeUseItem,
  makeUseItems,
  RelatedModel
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
  account: RelatedModel & HasIcon;
  category: (RelatedModel & HasIcon & HasName) | null;
  payee: RelatedModel | null;
  tags: (RelatedModel & HasColor)[];

  datetime: Date;

  amount: string;
  amount_currency: string;

  readonly is_transfer: boolean;
  readonly is_initial: boolean;

  text: string;
  reference: string;

  related_transaction: number;

  readonly label: string;

  // Only used in frontend
  readonly type: "expense" | "income";
}

export const mapTransaction = (tx: Transaction) => {
  tx.datetime = new Date(tx.datetime);
  return tx;
};

export const [useTransactions, prefetchTransactions] = makeUseItems<
  Transaction
>("transactions", mapTransaction);

export const useTransaction = makeUseItem<Transaction>(
  "transactions",
  mapTransaction
);

export const postTransaction = makePostItem<Transaction>("transactions");

export const putTransaction = makePutItem<Transaction>("transactions");

export const deleteTransaction = makeDeleteItem<Transaction>("transactions");

export const bulkDeleteTransactions = makeItemsAction(
  "transactions",
  "bulk_delete",
  "DELETE"
);

export const canEdit = (tx: Transaction) => {
  return !tx.is_initial;
};

export const canDelete = (tx: Transaction) => {
  return !tx.is_initial;
};
