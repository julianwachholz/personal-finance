import {
  makeDeleteItem,
  makeFetchItems,
  makePostItem,
  makePutItem,
  makeUseItem
} from "./base";

export interface Tag {
  pk: number;
  name: string;
  color: string;

  readonly label: string;
}

export const fetchTags = makeFetchItems<Tag>("tags");

export const postTag = makePostItem<Tag>("tags");

export const putTag = makePutItem<Tag>("tags");

export const deleteTag = makeDeleteItem<Tag>("tags");

export const useTag = makeUseItem<Tag>("tags");
