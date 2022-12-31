import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { Card, message } from "antd";

import { get } from "../../request";
import { ICommentListResponse } from "../api/Comment";
import CommentCreate from "./CommentCreate";
import { IComment } from "./CommentItem";
import CommentList from "./CommentList";
import { IAnswerCount } from "./CommentBox";

interface IWidget {
  resId?: string;
  resType?: string;
  changedAnswerCount?: IAnswerCount;
  onSelect?: Function;
  onItemCountChange?: Function;
}
const Widget = ({
  resId,
  resType,
  onSelect,
  changedAnswerCount,
  onItemCountChange,
}: IWidget) => {
  const intl = useIntl();
  const [data, setData] = useState<IComment[]>([]);
  useEffect(() => {
    console.log("changedAnswerCount", changedAnswerCount);
    const newData = data.map((item) => {
      const newItem = item;
      if (newItem.id && changedAnswerCount?.id === newItem.id) {
        newItem.childrenCount = changedAnswerCount.count;
      }
      return newItem;
    });
    setData(newData);
  }, [changedAnswerCount]);

  useEffect(() => {
    get<ICommentListResponse>(`/v2/discussion?view=question&id=${resId}`)
      .then((json) => {
        console.log(json);
        if (json.ok) {
          console.log(intl.formatMessage({ id: "flashes.success" }));
          const discussions: IComment[] = json.data.rows.map((item) => {
            return {
              id: item.id,
              resId: item.res_id,
              resType: item.res_type,
              user: {
                id: item.editor?.id ? item.editor.id : "",
                nickName: item.editor?.nickName ? item.editor.nickName : "",
                realName: item.editor?.userName ? item.editor.userName : "",
                avatar: item.editor?.avatar ? item.editor.avatar : "",
              },
              title: item.title,
              content: item.content,
              childrenCount: item.children_count,
              createdAt: item.created_at,
              updatedAt: item.updated_at,
            };
          });
          setData(discussions);
        } else {
          message.error(json.message);
        }
      })
      .catch((e) => {
        message.error(e.message);
      });
  }, [resId]);

  if (typeof resId === "undefined") {
    return <div>该资源尚未创建，不能发表讨论。</div>;
  }

  return (
    <div>
      <Card title="问题列表" extra={<a href="#">More</a>}>
        <CommentList
          onSelect={(
            e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
            comment: IComment
          ) => {
            if (typeof onSelect !== "undefined") {
              onSelect(e, comment);
            }
          }}
          data={data}
        />
        {resId && resType ? (
          <CommentCreate
            resId={resId}
            resType={resType}
            onCreated={(e: IComment) => {
              const newData = JSON.parse(JSON.stringify(e));
              console.log("create", e);
              if (typeof onItemCountChange !== "undefined") {
                onItemCountChange(data.length + 1);
              }
              setData([...data, newData]);
            }}
          />
        ) : (
          <></>
        )}
      </Card>
    </div>
  );
};

export default Widget;