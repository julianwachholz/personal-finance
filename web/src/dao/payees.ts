import {
  makeDeleteItem,
  makePostItem,
  makePutItem,
  makeUseItem,
  makeUseItems
} from "./base";

type PayeeType = "business" | "private";

export interface Payee {
  pk: number;
  name: string;
  type: PayeeType;

  readonly label: string;
}

export const usePayees = makeUseItems<Payee>("payees");

export const postPayee = makePostItem<Payee>("payees");

export const putPayee = makePutItem<Payee>("payees");

export const deletePayee = makeDeleteItem<Payee>("payees");

export const usePayee = makeUseItem<Payee>("payees");
