import {
  makeDeleteItem,
  makeItemAction,
  makeItemsAction,
  makePostItem,
  makePutItem,
  makeUseItem,
  makeUseItems,
  RelatedModel
} from "./base";

export interface Category {
  pk: number;
  name: string;
  icon: string;
  color: string;
  parent: RelatedModel | null;

  set_icon?: string;
  set_color?: string;
  readonly my_icon: string;
  readonly my_color: string;

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

export const [useCategoryTree, prefetchCategoryTree] = makeUseItems<
  TreeCategory
>("categories/tree");

export type MovePosition = "first-child" | "last-child" | "left" | "right";

interface MoveCategory {
  pk: number;
  target_pk: number;
  position: MovePosition;
}

export const moveCategory = makeItemAction<MoveCategory>("categories", "move");

export const createDefaultCategories = makeItemsAction<{}>(
  "categories",
  "create_default"
);
