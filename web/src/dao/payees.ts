import {
  makeDeleteItem,
  makeItemsAction,
  makePatchItem,
  makePostItem,
  makePutItem,
  makeUseItem,
  makeUseItems,
  RelatedModel
} from "./base";

type PayeeType = "business" | "private";

export interface Payee {
  pk: number | string;
  name: string;
  type: PayeeType;
  default_category: RelatedModel | null;

  readonly label: string;
}

export const [usePayees, prefetchPayees] = makeUseItems<Payee>("payees");

export const usePayee = makeUseItem<Payee>("payees");

export const postPayee = makePostItem<Payee>("payees");

export const putPayee = makePutItem<Payee>("payees");

export const patchPayee = makePatchItem<Payee>("payees");

export const deletePayee = makeDeleteItem<Payee>("payees");

export const bulkDeletePayees = makeItemsAction(
  "payees",
  "bulk_delete",
  "DELETE"
);
