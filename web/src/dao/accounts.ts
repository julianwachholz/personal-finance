import {
  makeDeleteItem,
  makeFetchItems,
  makePostItem,
  makePutItem,
  makeUseItem
} from "./base";

export interface Account {
  pk: number;
  name: string;
  icon: string;
  institution: string;
  balance: string;
  balance_currency: string;
  pos: number;

  readonly label: string;
}

export const fetchAccounts = makeFetchItems<Account>("accounts");

export const postAccount = makePostItem<Account>("accounts");

export const putAccount = makePutItem<Account>("accounts");

export const deleteAccount = makeDeleteItem<Account>("accounts");

export const useAccount = makeUseItem<Account>("accounts");
