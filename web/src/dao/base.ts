import { prefetchQuery, QueryResult, useQuery } from "react-query";

const authTokenKey = "_auth_token";
const authTokenExpiryKey = "_auth_token_expiry";

export const setAuthToken = (token: string, expiry: string) => {
  localStorage.setItem(authTokenKey, token);
  localStorage.setItem(authTokenExpiryKey, expiry);
};

export const clearToken = () => {
  localStorage.removeItem(authTokenKey);
  localStorage.removeItem(authTokenExpiryKey);
};

const getAuthToken = () => {
  return localStorage.getItem(authTokenKey);
};

export const authFetch = (input: RequestInfo, init: RequestInit = {}) => {
  const token = getAuthToken();
  if (token) {
    init.headers = {
      ...init.headers,
      Authorization: `Token ${getAuthToken()}`
    };
  }
  return fetch(input, init);
};

interface FetchItemsOptions {
  page?: number;
  pageSize?: number;
  ordering?: string;
  filters?: string[];
  search?: string;
}

export interface Model {
  pk: number;
}

export interface ModelWithLabel {
  pk: number;
  label: string;
}

interface Items<T extends Model> {
  count: number;
  results: T[];
}

export type FetchItems<T extends ModelWithLabel> = (
  options: FetchItemsOptions
) => Promise<Items<T>>;

export const makeFetchItems = <T extends ModelWithLabel>(
  basename: string,
  map?: (item: T) => T
) => {
  const fetchItems: FetchItems<T> = async (options = {}) => {
    const { page = 1, pageSize, ordering, filters, search } = options;
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
    const response = await authFetch(url);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data: Items<T> = await response.json();

    if (map) {
      data.results.map(map);
    }
    return data;
  };

  return fetchItems;
};

export interface UseItems<T extends ModelWithLabel> {
  (options?: FetchItemsOptions): QueryResult<Items<T>, FetchItemsOptions>;

  basename: string;
}

type PrefetchItems<T extends ModelWithLabel> = (
  options?: FetchItemsOptions
) => Promise<Items<T>>;

export const makeUseItems = <T extends ModelWithLabel>(
  basename: string,
  map?: (item: T) => T,
  fetchItems?: FetchItems<T>
): [UseItems<T>, PrefetchItems<T>] => {
  if (!fetchItems) {
    fetchItems = makeFetchItems<T>(basename, map);
  }
  const useItems: UseItems<T> = (options: FetchItemsOptions = {}) => {
    const query = useQuery([`items/${basename}`, options], fetchItems!);
    return query;
  };
  useItems.basename = basename;
  const prefetchItems: PrefetchItems<T> = (options: FetchItemsOptions = {}) => {
    return prefetchQuery([basename, options], fetchItems!, {
      staleTime: 500
    });
  };
  return [useItems, prefetchItems];
};

interface FetchItemOptions {
  pk: number;
}
export type FetchItem<T extends Model, O = FetchItemOptions> = (
  options: O
) => Promise<T>;

export const makeFetchItem = <T extends Model>(basename: string) => {
  const fetchItem: FetchItem<T> = async ({ pk }) => {
    if (isNaN(pk)) {
      throw new Error("Invalid ID");
    }
    const url = `/api/${basename}/${pk}/`;
    const response = await authFetch(url);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    return data;
  };
  return fetchItem;
};

type UseItem<T extends Model> = (
  pk: number | string
) => QueryResult<T, { pk: number }>;

export const makeUseItem = <T extends Model>(basename: string) => {
  const fetchItem = makeFetchItem<T>(basename);
  const useItem: UseItem<T> = pk => {
    if (typeof pk === "string") {
      pk = parseInt(pk, 10);
    }
    const query = useQuery([`item/${basename}`, { pk }], fetchItem);
    return query;
  };
  return useItem;
};

type MutateItem<T extends Model, RT> = (data: T) => Promise<RT>;

const makeItemMutation = <T extends Model, RT = T>(
  basename: string,
  method: string
) => {
  const mutateItem: MutateItem<T, RT> = async data => {
    const url =
      method === "POST" ? `/api/${basename}/` : `/api/${basename}/${data.pk}/`;
    const response = await authFetch(url, {
      method,
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(data)
    });
    if (response.status === 204) {
      return;
    }
    let responseData;
    try {
      responseData = await response.json();
    } catch (e) {
      throw new Error(response.statusText);
    }
    if (!response.ok) {
      throw responseData;
    }
    return responseData;
  };
  return mutateItem;
};

export const makePostItem = <T extends Model>(basename: string) => {
  return makeItemMutation<T>(basename, "POST");
};

export const makePutItem = <T extends Model>(basename: string) => {
  return makeItemMutation<T>(basename, "PUT");
};

export const makeDeleteItem = <T extends Model>(basename: string) => {
  return makeItemMutation<T, void>(basename, "DELETE");
};

export interface ItemsActionParams {
  pks?: number[];
}

type ItemsAction<P = ItemsActionParams> = (params: P) => Promise<any>;

export const makeItemsAction = <P = ItemsActionParams>(
  basename: string,
  action: string,
  method: string = "POST"
) => {
  const itemsAction: ItemsAction<P> = async params => {
    const url = `/api/${basename}/${action}/`;
    const response = await authFetch(url, {
      method,
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(params)
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    if (response.status === 204) {
      return;
    }
    const responseData = await response.json();
    return responseData;
  };
  return itemsAction;
};

type ItemAction<T extends Model> = (params: T) => Promise<any>;

export const makeItemAction = <T extends Model>(
  basename: string,
  action: string,
  method: string = "POST"
) => {
  const itemAction: ItemAction<T> = async ({ pk, ...params }) => {
    const url = `/api/${basename}/${pk}/${action}/`;
    const response = await authFetch(url, {
      method,
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(params)
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    if (response.status === 204) {
      return;
    }
    const responseData = await response.json();
    return responseData;
  };
  return itemAction;
};
