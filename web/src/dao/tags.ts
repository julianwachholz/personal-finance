import {
  makeDeleteItem,
  makeItemsAction,
  makePostItem,
  makePutItem,
  makeUseItem,
  makeUseItems
} from "./base";

export interface Tag {
  pk: number;
  name: string;
  color: string;

  readonly label: string;
}

export const [useTags, prefetchTags] = makeUseItems<Tag>("tags");

export const useTag = makeUseItem<Tag>("tags");

export const postTag = makePostItem<Tag>("tags");

export const putTag = makePutItem<Tag>("tags");

export const deleteTag = makeDeleteItem<Tag>("tags");

export const bulkDeleteTags = makeItemsAction("tags", "bulk_delete", "DELETE");
