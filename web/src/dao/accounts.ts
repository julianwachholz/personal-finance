import {
  makeDeleteItem,
  makeItemAction,
  makePostItem,
  makePutItem,
  makeUseItem,
  makeUseItems,
  RelatedModel
} from "./base";

export interface Account {
  pk: number;
  name: string;
  icon: string;
  institution: string;
  balance: string;
  currency: string;
  pos: number;

  set_balance: string;
  set_currency: string;

  readonly label: string;
}

// export const fetchAccounts = makeFetchItems<Account>("accounts");

export const [useAccounts, prefetchAccounts] = makeUseItems<Account>(
  "accounts"
);

export const postAccount = makePostItem<Account>("accounts");

export const putAccount = makePutItem<Account>("accounts");

export const deleteAccount = makeDeleteItem<Account>("accounts");

export const useAccount = makeUseItem<Account>("accounts");

interface MoveAccount {
  pk: number;
  pos: number;
}

export const moveAccount = makeItemAction<MoveAccount>("accounts", "move");

export interface AccountTransfer {
  pk: number;
  target: RelatedModel;
  amount: string;
  conversion_rate?: string;
  text?: string;
  datetime?: Date;
}

export const accountTransfer = makeItemAction<AccountTransfer>(
  "accounts",
  "transfer"
);
