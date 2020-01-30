import { ActivityIndicator, List, WhiteSpace } from "antd-mobile";
import React from "react";
import { useTranslation } from "react-i18next";
import AppHeader, { AppHeaderProps } from "../../components/layout/AppHeader";
import { ModelWithLabel, UseItemsPaginated } from "../../dao/base";
import { debounce } from "../../utils/debounce";
import useTitle from "../../utils/useTitle";

interface BaseListProps<T extends ModelWithLabel> {
  itemName: string;
  itemNamePlural: string;
  useItems: UseItemsPaginated<T>;
  renderRow: (item: T) => React.ReactElement;
  fab?: React.ReactElement;
  actions?: React.ReactElement[];
  headerProps?: Omit<AppHeaderProps, "title" | "extra" | "onClick">;
}

const BaseList = <T extends ModelWithLabel>({
  itemNamePlural,
  useItems,
  renderRow,
  fab,
  actions,
  headerProps
}: BaseListProps<T>) => {
  const [t] = useTranslation();
  const {
    data: pages,
    isLoading,
    isFetchingMore,
    fetchMore,
    canFetchMore
  } = useItems(
    { pageSize: 20 },
    {
      paginated: true,
      getCanFetchMore(lastPage) {
        return lastPage.next !== null;
      }
    }
  );

  const loadMore = async () => {
    try {
      const lastPage = pages![pages!.length - 1];
      await fetchMore({
        pageSize: 20,
        page: lastPage.next as number
      });
    } catch (e) {
      console.error(e);
    }
  };
  const onScroll = debounce((distanceToBottom: number) => {
    if (canFetchMore && distanceToBottom < 100) {
      loadMore();
    }
  }, 50);

  const listRef = React.createRef<HTMLDivElement>();

  useTitle(itemNamePlural);
  return (
    <div className="module module-list">
      <AppHeader
        title={itemNamePlural}
        extra={actions}
        onClick={() => {
          listRef.current?.scroll({
            top: 0,
            behavior: "smooth"
          });
        }}
        {...headerProps}
      />
      {fab}
      <div
        ref={listRef}
        className="am-list-wrap"
        onScroll={(e: any) => {
          const distanceToBottom =
            e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight;
          onScroll(distanceToBottom);
        }}
      >
        <List
          renderFooter={() =>
            isLoading || isFetchingMore ? (
              <ActivityIndicator text={t("loading", "Loading...")} />
            ) : (
              <WhiteSpace style={{ height: 22 }} />
            )
          }
        >
          {pages?.map(page => page.results.map(renderRow))}
        </List>
      </div>
    </div>
  );
};

export default BaseList;
