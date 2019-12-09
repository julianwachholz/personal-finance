import { useQuery } from "react-query";

interface IFetchItemsOptions {
  page: number;
  pageSize?: number;
  ordering?: string;
  filters?: string[];
  search?: string;
}

export interface IModel {
  pk: number;
}

interface IItems<T extends IModel> {
  count: number;
  results: T[];
}

export type FetchItems<T extends IModel> = (
  options: IFetchItemsOptions
) => Promise<IItems<T>>;

export const makeFetchItems = <T extends IModel>(basename: string) => {
  const fetchItems: FetchItems<T> = async ({
    page,
    pageSize,
    ordering,
    filters,
    search
  }) => {
    let url = `/api/${basename}/?page=${page}`;
    if (pageSize) {
      url += `&page_size=${pageSize}`;
    }
    if (ordering) {
      url += `&ordering=${ordering}`;
    }
    if (filters) {
      url += `&${filters.join("&")}`;
    }
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("response not ok");
    }
    const data = await response.json();
    return data;
  };

  return fetchItems;
};

interface IFetchItemOptions {
  pk: number;
}
type FetchItem<T extends IModel> = (options: IFetchItemOptions) => Promise<T>;

export const makeFetchItem = <T extends IModel>(basename: string) => {
  const fetchItem: FetchItem<T> = async ({ pk }) => {
    const url = `/api/${basename}/${pk}/`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("response not ok");
    }
    const data = await response.json();
    return data;
  };
  return fetchItem;
};


export const makeUseItem = <T extends IModel>(basename: string) => {
  const fetchItem = makeFetchItem<T>(basename);
  const useItem = (pk: number | string) => {
    if (typeof pk === 'string') {
      pk = parseInt(pk, 10)
    }
    const query = useQuery([`use_${basename}`, { pk }], fetchItem);
    return query;
  };
  return useItem;
};


type PostItem<T extends IModel> = (data: T) => Promise<T>;

export const makePostItem = <T extends IModel>(basename: string) => {
  const postItem: PostItem<T> = async data => {
    const url = `/api/${basename}/`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error("response not ok");
    }
    const responseData = await response.json();
    return responseData;
  };
  return postItem;
};

type PutItem<T extends IModel> = (data: T) => Promise<T>;

export const makePutItem = <T extends IModel>(basename: string) => {
  const putItem: PutItem<T> = async data => {
    const url = `/api/${basename}/${data.pk}/`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error("response not ok");
    }
    const responseData = await response.json();
    return responseData;
  };
  return putItem;
};

type DeleteItem<T extends IModel> = (data: T) => Promise<any>;

export const makeDeleteItem = <T extends IModel>(basename: string) => {
  const deleteItem: DeleteItem<T> = async ({ pk }) => {
    const url = `/api/${basename}/${pk}/`;
    const response = await fetch(url, {
      method: "DELETE"
    });
    if (!response.ok) {
      throw new Error("response not ok");
    }
    const responseData = await response.json();
    return responseData;
  };
  return deleteItem;
};
