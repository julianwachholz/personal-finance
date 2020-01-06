import {
  makeDeleteItem,
  makeItemsAction,
  makePostItem,
  makePutItem,
  makeUseItem,
  makeUseItems,
  ModelWithLabel
} from "./base";

type PayeeType = "business" | "private";

export interface Payee {
  pk: number;
  name: string;
  type: PayeeType;
  default_category?: ModelWithLabel;

  readonly label: string;
}

export const [usePayees, prefetchPayees] = makeUseItems<Payee>("payees");

export const usePayee = makeUseItem<Payee>("payees");

export const postPayee = makePostItem<Payee>("payees");

export const putPayee = makePutItem<Payee>("payees");

export const deletePayee = makeDeleteItem<Payee>("payees");

export const bulkDeletePayees = makeItemsAction(
  "payees",
  "bulk_delete",
  "DELETE"
);
