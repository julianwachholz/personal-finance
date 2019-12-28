import {
  makeDeleteItem,
  makeFetchItems,
  makePostItem,
  makePutItem,
  makeUseItem
} from "./base";

export interface Payee {
  pk: number;
  name: string;

  readonly label: string;
}

export const fetchPayees = makeFetchItems<Payee>("payees");

export const postPayee = makePostItem<Payee>("payees");

export const putPayee = makePutItem<Payee>("payees");

export const deletePayee = makeDeleteItem<Payee>("payees");

export const usePayee = makeUseItem<Payee>("payees");
