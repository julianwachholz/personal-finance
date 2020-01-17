import {
  makeDeleteItem,
  makePostItem,
  makePutItem,
  makeUseItem,
  makeUseItems,
  RelatedModel
} from "./base";

export type BudgetPeriod = "weekly" | "monthly" | "quarterly" | "yearly";

export interface Budget {
  pk: number;
  name: string;
  pos: number;
  period: BudgetPeriod;
  is_blacklist: boolean;
  categories: RelatedModel[];
  target: string;
  target_currency: string;

  readonly current_amount: string;
  readonly remaining_amount: string;
  readonly percentage: number;

  readonly label: string;
}

export const [useBudgets, prefetchBudgets] = makeUseItems<Budget>("budgets");

export const postBudget = makePostItem<Budget>("budgets");

export const putBudget = makePutItem<Budget>("budgets");

export const deleteBudget = makeDeleteItem<Budget>("budgets");

export const useBudget = makeUseItem<Budget>("budgets");
