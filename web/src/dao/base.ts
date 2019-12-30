import { useQuery } from "react-query";

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
  page: number;
  pageSize?: number;
  ordering?: string;
  filters?: string[];
  search?: string;
}

export interface Model {
  pk: number;
}

export interface RelatedModel {
  pk: number;
  label: string;
}

interface Items<T extends Model> {
  count: number;
  results: T[];
}

export type FetchItems<T extends Model> = (
  options: FetchItemsOptions
) => Promise<Items<T>>;

export const makeFetchItems = <T extends Model>(basename: string) => {
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
    const response = await authFetch(url);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    return data;
  };

  return fetchItems;
};

export const makeUseItems = <T extends Model>(basename: string) => {
  const fetchItems = makeFetchItems<T>(basename);
  const useItems = (options: FetchItemsOptions) => {
    const query = useQuery([`items/${basename}`, options], fetchItems);
    return query;
  };
  return useItems;
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

export const makeUseItem = <T extends Model>(basename: string) => {
  const fetchItem = makeFetchItem<T>(basename);
  const useItem = (pk: number | string) => {
    if (typeof pk === "string") {
      pk = parseInt(pk, 10);
    }
    const query = useQuery([`item/${basename}`, { pk }], fetchItem);
    return query;
  };
  return useItem;
};

type PostItem<T extends Model> = (data: T) => Promise<T>;

export const makePostItem = <T extends Model>(basename: string) => {
  const postItem: PostItem<T> = async data => {
    const url = `/api/${basename}/`;
    const response = await authFetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const responseData = await response.json();
    return responseData;
  };
  return postItem;
};

type PutItem<T extends Model> = (data: T) => Promise<T>;

export const makePutItem = <T extends Model>(basename: string) => {
  const putItem: PutItem<T> = async data => {
    const url = `/api/${basename}/${data.pk}/`;
    const response = await authFetch(url, {
      method: "PUT",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const responseData = await response.json();
    return responseData;
  };
  return putItem;
};

type DeleteItem<T extends Model> = (data: T) => Promise<void>;

export const makeDeleteItem = <T extends Model>(basename: string) => {
  const deleteItem: DeleteItem<T> = async ({ pk }) => {
    const url = `/api/${basename}/${pk}/`;
    const response = await authFetch(url, {
      method: "DELETE"
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
  };
  return deleteItem;
};

type PostAction<T extends Model> = (params: T) => Promise<any>;

export const makePostAction = <T extends Model>(
  basename: string,
  action: string
) => {
  const postAction: PostAction<T> = async ({ pk, ...params }) => {
    const url = `/api/${basename}/${pk}/${action}/`;
    const response = await authFetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(params)
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const responseData = await response.json();
    return responseData;
  };
  return postAction;
};
