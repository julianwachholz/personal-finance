import { parseISO } from "date-fns";
import {
  prefetchQuery,
  QueryOptions,
  QueryOptionsPaginated,
  QueryResult,
  QueryResultPaginated,
  useQuery
} from "react-query";

export type ErrorResponse = {
  [index: string]: string[];

  // Special errors not attached to a field
  non_field_errors: string[];
};

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

export const getAuthToken = () => {
  return localStorage.getItem(authTokenKey);
};

export const isTokenValid = () => {
  const expiry = localStorage.getItem(authTokenExpiryKey);
  if (expiry) {
    const date = parseISO(expiry);
    return date > new Date();
  }
  return false;
};

export const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  if (token) {
    return {
      Authorization: `Token ${token}`
    };
  }
  return {};
};

export const authFetch = (input: RequestInfo, init: RequestInit = {}) => {
  const language = localStorage.getItem("i18nextLng");
  init.headers = {
    ...getAuthHeaders(),
    ...init.headers,
    "Accept-Language": language ?? "en"
  };
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
  pk: number | string;
}

export interface ModelWithLabel {
  pk: number | string;
  label: string;
}

export interface RelatedModel {
  value: number | string;
  label: string;
}

interface Items<T extends Model> {
  count: number;
  next: number | null;
  previous: number | null;
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
  (
    options?: FetchItemsOptions,
    queryOptions?: QueryOptions<Items<T>>
  ): QueryResult<Items<T>, FetchItemsOptions>;

  basename: string;
}

export interface UseItemsPaginated<T extends ModelWithLabel> {
  (
    options?: FetchItemsOptions,
    queryOptions?: QueryOptionsPaginated<Items<T>>
  ): QueryResultPaginated<Items<T>, FetchItemsOptions>;

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
  const useItems: UseItems<T> = (
    options: FetchItemsOptions = {},
    queryOptions?: QueryOptions<Items<T>>
  ) => {
    const query = useQuery(
      [`items/${basename}`, options],
      fetchItems!,
      queryOptions
    );
    return query;
  };
  useItems.basename = basename;

  const prefetchItems: PrefetchItems<T> = (options: FetchItemsOptions = {}) => {
    return prefetchQuery([`items/${basename}`, options], fetchItems!, {
      staleTime: 1000
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

export const makeFetchItem = <T extends Model>(
  basename: string,
  map?: (item: T) => T
) => {
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
    if (map) {
      return map(data);
    }
    return data;
  };
  return fetchItem;
};

type UseItem<T extends Model> = (
  pk?: number | string,
  queryOptions?: QueryOptions<T>
) => QueryResult<T, { pk: number }>;

export const makeUseItem = <T extends Model>(
  basename: string,
  map?: (item: T) => T,
  fetchItem?: FetchItem<T>
) => {
  if (!fetchItem) {
    fetchItem = makeFetchItem<T>(basename, map);
  }
  const useItem: UseItem<T> = (pk, queryOptions) => {
    if (typeof pk === "string") {
      pk = parseInt(pk, 10);
    }
    const query = useQuery(
      !!pk && [`item/${basename}`, { pk }],
      fetchItem!,
      queryOptions
    );
    return query;
  };
  return useItem;
};

export type MutateItem<T extends Model, RT> = (data: T) => Promise<RT>;

interface ItemMutationOptions {
  noId: boolean;
}

const makeItemMutation = <T extends Model, RT = T>(
  basename: string,
  method: string,
  options?: ItemMutationOptions
) => {
  const mutateItem: MutateItem<T, RT> = async data => {
    const url =
      method === "POST" || options?.noId
        ? `/api/${basename}/`
        : `/api/${basename}/${data.pk}/`;
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

export const makePutItem = <T extends Model>(
  basename: string,
  options?: ItemMutationOptions
) => {
  return makeItemMutation<T>(basename, "PUT", options);
};

export const makePatchItem = <T extends Model>(
  basename: string,
  options?: ItemMutationOptions
) => {
  return makeItemMutation<Pick<T, "pk"> & Partial<T>>(
    basename,
    "PATCH",
    options
  );
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
  return itemsAction;
};

const getURLParams = (params: object) => {
  const entries = Object.entries(params);
  const items = entries.map(([k, v]) => `${k}=${v}`);
  return items.join("&");
};

type ItemAction<T extends Model, RT = any> = (params: T) => Promise<RT>;

export const makeItemAction = <T extends Model, RT = any>(
  basename: string,
  action: string,
  method: string = "POST"
) => {
  const itemAction: ItemAction<T, RT> = async ({ pk, ...params }) => {
    let url = `/api/${basename}/${pk}/${action}/`;
    const extra: Record<string, string> = {};
    if (method === "GET") {
      url += `?${getURLParams(params)}`;
    } else {
      extra.body = JSON.stringify(params);
    }
    const response = await authFetch(url, {
      method,
      headers: {
        "content-type": "application/json"
      },
      ...extra
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
  return itemAction;
};
