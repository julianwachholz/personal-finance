import {
  makeDeleteItem,
  makeFetchItem,
  makeFetchItems,
  makePostItem,
  makePutItem
} from "./base";

export interface IAccount {
  pk: number;
  name: string;
  icon: string;
  institution: string;
  balance: string;
  balance_currency: string;
  pos: number;

  readonly label: string;
}

export const fetchAccounts = makeFetchItems<IAccount>("accounts");

export const fetchAccount = makeFetchItem<IAccount>("accounts");

export const postAccount = makePostItem<IAccount>("accounts");

export const putAccount = makePutItem<IAccount>("accounts");

export const deleteAccount = makeDeleteItem<IAccount>("accounts");
