import { makeFetchItems } from "./base";

export interface ITransaction {
  pk: number;
  account_id: number;
  category_id: number;
  payee_id: number;
  tag_ids: number[];

  datetime: Date;

  amount: string;
  amount_currency: string;

  text: string;
  reference: string;
}

export const fetchTransactions = makeFetchItems<ITransaction>("transactions");
