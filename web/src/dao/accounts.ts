import { makeFetchItem, makeFetchItems, makePutItem } from "./base";

export const fetchAccounts = makeFetchItems("accounts");

export const fetchAccount = makeFetchItem("accounts");

export const putAccount = makePutItem("accounts");
