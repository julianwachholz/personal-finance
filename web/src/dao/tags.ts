import { makeFetchItems, makeUseItem, makePutItem, makePostItem } from "./base";

export interface ITag {
    pk: number;
    name: string;
    color: string;

    readonly label: string;
}

export const fetchTags = makeFetchItems<ITag>("tags");

export const postTag = makePostItem<ITag>("tags");

export const putTag = makePutItem<ITag>("tags");

export const useTag = makeUseItem<ITag>("tags");
