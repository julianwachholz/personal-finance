import { DeleteFilled, TagOutlined } from "@ant-design/icons";
import { message, Tag as TagComponent } from "antd";
import { List, SwipeAction } from "antd-mobile";
import { History } from "history";
import React from "react";
import { MutateFunction, useMutation } from "react-query";
import { useHistory } from "react-router-dom";
import Fab from "../../components/button/Fab";
import { UseItemsPaginated } from "../../dao/base";
import { deleteTag, Tag, useTags } from "../../dao/tags";
import BaseList from "../base/BaseList";

const renderTag = (
  history: History,
  doDelete: MutateFunction<void, Tag>,
  tag: Tag
) => {
  return (
    <SwipeAction
      key={tag.pk}
      left={
        [
          {
            text: <DeleteFilled />,
            style: { width: 48, backgroundColor: "#f00", color: "#fff" },
            async onPress() {
              await doDelete();
              message.info(`Deleted Tag ${tag.label}`);
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
  const history = useHistory();
  const [doDelete] = useMutation(deleteTag, {
    refetchQueries: ["items/tags"]
  });

  return (
    <BaseList
      itemName="Tag"
      itemNamePlural="Tags"
      useItems={useTags as UseItemsPaginated<Tag>}
      renderRow={renderTag.bind(null, history, doDelete)}
      headerProps={{
        onLeftClick() {
          history.go(-1);
        }
      }}
      fab={
        <Fab
          icon={<TagOutlined />}
          onClick={() => {
            // history.push(`/settings/tags/create`);
          }}
        />
      }
    />
  );
};

export default TagList;
