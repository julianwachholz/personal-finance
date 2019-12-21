import { FetchItems, makeFetchItems } from "./base";

export interface Transaction {
  pk: number;
  account: number;
  category: number;
  payee: number;
  tags: number[];

  datetime: Date;

  amount: string;
  amount_currency: string;

  text: string;
  reference: string;
}

const _fetchTransactions = makeFetchItems<Transaction>("transactions");

export const fetchTransactions: FetchItems<Transaction> = async options => {
  const data = await _fetchTransactions(options);
  data.results.map(tx => {
    tx.datetime = new Date(tx.datetime);
  });
  return data;
};
