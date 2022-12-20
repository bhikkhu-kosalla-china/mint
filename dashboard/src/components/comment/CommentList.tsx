import { List, Avatar, Space } from "antd";
import { MessageOutlined } from "@ant-design/icons";

import { IComment } from "./CommentItem";

interface IWidget {
  data: IComment[];
  onSelect?: Function;
}
const Widget = ({ data, onSelect }: IWidget) => {
  return (
    <div>
      <List
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 10,
        }}
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Space>
                <MessageOutlined /> {"5"}
              </Space>,
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title={
                <span
                  onClick={(e) => {
                    if (typeof onSelect !== "undefined") {
                      onSelect(e, item);
                    }
                  }}
                >
                  {item.title ? item.title : item.content?.slice(0, 20)}
                </span>
              }
              description={item.content?.slice(0, 40)}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default Widget;
