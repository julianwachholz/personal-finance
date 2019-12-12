import { makeFetchItems, makeUseItem } from "./base";

export interface ICategory {
  pk: number;
  name: string;
  icon: string;
  color: string;

  readonly label: string;
}

export const fetchCategoryTree = makeFetchItems<ICategory>("categories/tree");

export const fetchCategories = makeFetchItems<ICategory>("categories");

export const useCategory = makeUseItem<ICategory>("categories");
