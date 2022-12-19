import { Button, Card, Dropdown, Space } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";

import { IComment } from "./CommentItem";
import TimeShow from "../general/TimeShow";

interface IWidget {
  data: IComment;
  onEdit?: Function;
}
const Widget = ({ data, onEdit }: IWidget) => {
  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    switch (e.key) {
      case "edit":
        if (typeof onEdit !== "undefined") {
          onEdit();
        }
        break;
      default:
        break;
    }
  };

  const items: MenuProps["items"] = [
    {
      key: "copy-link",
      label: "复制链接",
    },
    {
      key: "reply",
      label: "回复",
    },
    {
      type: "divider",
    },
    {
      key: "edit",
      label: "编辑",
    },
    {
      key: "delete",
      label: "删除",
    },
    {
      type: "divider",
    },
    {
      key: "report-content",
      label: "举报",
    },
  ];
  return (
    <div>
      <Card
        title={
          <Space>
            {data.user.nickName}
            <TimeShow time={data.updatedAt} title="UpdatedAt" />
          </Space>
        }
        extra={
          <Dropdown menu={{ items, onClick }} placement="bottomRight">
            <Button
              shape="circle"
              size="small"
              icon={<MoreOutlined />}
            ></Button>
          </Dropdown>
        }
        style={{ width: "auto" }}
      >
        {data.content}
      </Card>
    </div>
  );
};

export default Widget;
