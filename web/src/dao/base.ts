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
