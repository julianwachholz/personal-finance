import { makeFetchItems } from "./base";

export interface ITransaction {
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

export const fetchTransactions = makeFetchItems<ITransaction>("transactions");
