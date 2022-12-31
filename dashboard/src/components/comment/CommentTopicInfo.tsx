import { Typography, Space, message } from "antd";
import { useEffect, useState } from "react";
import { get } from "../../request";
import { ICommentResponse } from "../api/Comment";
import TimeShow from "../general/TimeShow";

import { IComment } from "./CommentItem";

const { Title, Text } = Typography;

interface IWidget {
  topicId?: string;
}
const Widget = ({ topicId }: IWidget) => {
  const [data, setData] = useState<IComment>();
  useEffect(() => {
    if (typeof topicId === "undefined") {
      return;
    }
    get<ICommentResponse>(`/v2/discussion/${topicId}`)
      .then((json) => {
        console.log(json);
        if (json.ok) {
          console.log("flashes.success");
          const item = json.data;
          const discussion: IComment = {
            id: item.id,
            resId: item.res_id,
            resType: item.res_type,
            user: {
              id: item.editor?.id ? item.editor.id : "null",
              nickName: item.editor?.nickName ? item.editor.nickName : "null",
              realName: item.editor?.userName ? item.editor.userName : "null",
              avatar: item.editor?.avatar ? item.editor.avatar : "null",
            },
            title: item.title,
            content: item.content,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
          };
          setData(discussion);
        } else {
          message.error(json.message);
        }
      })
      .catch((e) => {
        message.error(e.message);
      });
  }, [topicId]);
  return (
    <div>
      <Title editable level={1} style={{ margin: 0 }}>
        {data?.title}
      </Title>
      <div>
        <Text type="secondary">
          <Space>
            {" "}
            {data?.user.nickName}{" "}
            <TimeShow time={data?.createdAt} title="创建" />
          </Space>
        </Text>
      </div>
    </div>
  );
};

export default Widget;