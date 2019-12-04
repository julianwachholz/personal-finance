interface IFetchItemsOptions {
  page: number;
  pageSize?: number;
  ordering?: string;
  search?: string;
}
export type FetchItems = (options: IFetchItemsOptions) => Promise<any>;

export const makeFetchItems = (basename: string) => {
  const fetchItems: FetchItems = async ({
    page,
    pageSize,
    ordering,
    search
  }) => {
    let url = `/api/${basename}/?page=${page}`;
    if (pageSize) {
      url += `&page_size=${pageSize}`;
    }
    if (ordering) {
      url += `&ordering=${ordering}`;
    }
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    const response = await fetch(url);
    const data = await response.json();
    return data;
  };

  return fetchItems;
};

interface IFetchItemOptions {
  pk: number;
}
type FetchItem = (options: IFetchItemOptions) => Promise<any>;

export const makeFetchItem = (basename: string) => {
  const fetchItem: FetchItem = async ({ pk }) => {
    const url = `/api/${basename}/${pk}/`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  };
  return fetchItem;
};

export const makePutItem = (basename: string) => {
  const putItem = async (data: any) => {
    const url = `/api/${basename}/${data.pk}/`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data)
    });
    const responseData = await response.json();
    return responseData;
  };
  return putItem;
};
