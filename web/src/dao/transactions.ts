import {
  makeFetchItems,
  makePostItem,
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

  is_transfer: boolean;
  is_initial: boolean;

  text: string;
  reference: string;

  readonly label: string;
}

const mapTx = (tx: Transaction) => {
  tx.datetime = new Date(tx.datetime);
  return tx;
};

export const fetchTransactions = makeFetchItems<Transaction>(
  "transactions",
  mapTx
);

export const useTransactions = makeUseItems<Transaction>(
  "transactions",
  mapTx,
  fetchTransactions
);

export const postTransaction = makePostItem<Transaction>("transactions");
