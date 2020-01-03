import {
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

export const [useTransactions, prefetchTransactions] = makeUseItems<
  Transaction
>("transactions", mapTx);

export const postTransaction = makePostItem<Transaction>("transactions");

export const putTransaction = makePutItem<Transaction>("transactions");
