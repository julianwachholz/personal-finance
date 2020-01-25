import { DeleteFilled, FormOutlined, TagOutlined } from "@ant-design/icons";
import { Tag as TagComponent } from "antd";
import { List, SwipeAction } from "antd-mobile";
import { History } from "history";
import { TFunction } from "i18next";
import React from "react";
import { useTranslation } from "react-i18next";
import { MutateFunction, useMutation } from "react-query";
import { useHistory } from "react-router-dom";
import Fab from "../../components/button/Fab";
import { UseItemsPaginated } from "../../dao/base";
import { deleteTag, Tag, useTags } from "../../dao/tags";
import { COLOR_DANGER, COLOR_PRIMARY } from "../../utils/constants";
import BaseList from "../base/BaseList";
import { confirmDeleteTag } from "./delete";

const renderTag = (
  history: History,
  doDelete: MutateFunction<void, Tag>,
  t: TFunction,
  tag: Tag
) => {
  return (
    <SwipeAction
      key={tag.pk}
      left={
        [
          {
            text: <DeleteFilled />,
            style: { width: 48, backgroundColor: COLOR_DANGER, color: "#fff" },
            onPress() {
              confirmDeleteTag(tag, doDelete, t);
            }
          }
        ] as any
      }
      right={
        [
          {
            text: <FormOutlined />,
            style: { width: 48, backgroundColor: COLOR_PRIMARY, color: "#fff" },
            onPress() {
              history.push(`/settings/tags/${tag.pk}/edit`, { back: -1 });
            }
          }
        ] as any
      }
    >
      <List.Item
        extra={
          <TagComponent color={tag.color}>
            {tag.color || "default"}
          </TagComponent>
        }
        onClick={() => {
          history.push(`/settings/tags/${tag.pk}`);
        }}
      >
        {tag.label}
      </List.Item>
    </SwipeAction>
  );
};

const TagList = () => {
  const [t] = useTranslation("tags");
  const history = useHistory();
  const [doDelete] = useMutation(deleteTag, {
    refetchQueries: ["items/tags"]
  });

  return (
    <BaseList
      itemName={t("tags:tag", "Tag")}
      itemNamePlural={t("tags:tag_plural", "Tags")}
      useItems={useTags as UseItemsPaginated<Tag>}
      renderRow={renderTag.bind(null, history, doDelete, t)}
      headerProps={{
        onLeftClick() {
          history.go(-1);
        }
      }}
      fab={
        <Fab
          icon={<TagOutlined />}
          onClick={() => {
            history.push(`/settings/tags/create`);
          }}
        />
      }
    />
  );
};

export default TagList;
