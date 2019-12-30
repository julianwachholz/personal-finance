import { FetchItems, makeFetchItems, RelatedModel } from "./base";

export interface Transaction {
  pk: number;
  account: RelatedModel;
  category?: RelatedModel;
  payee?: RelatedModel;
  tags: RelatedModel[];

  datetime: Date;

  amount: string;
  amount_currency: string;

  is_transfer: boolean;

  text: string;
  reference: string;
}

const _fetchTransactions = makeFetchItems<Transaction>("transactions");

export const fetchTransactions: FetchItems<Transaction> = async options => {
  const data = await _fetchTransactions(options);
  data.results.map(tx => (tx.datetime = new Date(tx.datetime)));
  return data;
};
