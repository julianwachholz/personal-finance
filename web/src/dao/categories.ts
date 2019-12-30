import {
  makeDeleteItem,
  makeFetchItems,
  makePostAction,
  makePostItem,
  makePutItem,
  makeUseItem,
  makeUseItems
} from "./base";

export interface Category {
  pk: number;
  name: string;
  icon: string;
  color: string;

  readonly label: string;
}

export const postCategory = makePostItem<Category>("categories");

export const putCategory = makePutItem<Category>("categories");

export const deleteCategory = makeDeleteItem<Category>("categories");

export const useCategory = makeUseItem<Category>("categories");

export interface TreeCategory extends Category {
  readonly value: number;
  readonly children?: TreeCategory[];
}

export const fetchCategoryTree = makeFetchItems<TreeCategory>(
  "categories/tree"
);

export const useCategoryTree = makeUseItems<TreeCategory>("categories/tree");

export type MovePosition = "first-child" | "last-child" | "left" | "right";

export interface MoveCategory {
  pk: number;
  target_pk: number;
  position: MovePosition;
}

export const moveCategory = makePostAction<MoveCategory>("categories", "move");
