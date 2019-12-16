import {
  makeDeleteItem,
  makeFetchItems,
  makePostAction,
  makePostItem,
  makePutItem,
  makeUseItem,
  makeUseItems
} from "./base";

export interface ICategory {
  pk: number;
  name: string;
  icon: string;
  color: string;

  readonly label: string;
}

export const fetchCategories = makeFetchItems<ICategory>("categories");

export const postCategory = makePostItem<ICategory>("categories");

export const putCategory = makePutItem<ICategory>("categories");

export const deleteCategory = makeDeleteItem<ICategory>("categories");

export const useCategory = makeUseItem<ICategory>("categories");

export interface ITreeCategory extends ICategory {
  readonly value: number;
  readonly children: ITreeCategory[];
}

export const fetchCategoryTree = makeFetchItems<ITreeCategory>(
  "categories/tree"
);

export const useCategoryTree = makeUseItems<ITreeCategory>("categories/tree");

export type MovePosition = "first-child" | "last-child" | "left" | "right";

export interface IMoveCategory {
  pk: number;
  target_pk: number;
  position: MovePosition;
}

export const moveCategory = makePostAction<IMoveCategory>(
  "categories",
  "move_to"
);
