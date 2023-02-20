//主讲人列表
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, List, message, Typography } from "antd";

import { ICourse } from "../../pages/library/course/course";
import { ICourseListResponse } from "../api/Course";
import { API_HOST, get } from "../../request";

const { Paragraph } = Typography;

const Widget = () => {
  const [data, setData] = useState<ICourse[]>();
  const navigate = useNavigate();

  useEffect(() => {
    get<ICourseListResponse>(`/v2/course?view=new&limit=4`).then((json) => {
      if (json.ok) {
        console.log(json.data);
        const course: ICourse[] = json.data.rows.map((item) => {
          return {
            id: item.id,
            title: item.title,
            subtitle: item.subtitle,
            teacher: item.teacher,
            intro: item.content,
            coverUrl: item.cover,
          };
        });
        setData(course);
      } else {
        message.error(json.message);
      }
    });
  }, []);
  return (
    <List
      size="small"
      split={false}
      dataSource={data}
      renderItem={(item) => (
        <List.Item>
          <Card
            style={{ width: "100%", height: 200, borderRadius: 20 }}
            hoverable
            onClick={(e) => {
              navigate(`/course/show/${item.id}`);
            }}
          >
            <div style={{ display: "flex" }}>
              <div style={{ flex: 3 }}>
                <img
                  alt="example"
                  src={API_HOST + "/" + item.coverUrl}
                  width="150"
                  height="150"
                />
              </div>
              <div style={{ flex: 7 }}>
                <h3>{item.title}</h3>
                <Paragraph ellipsis={{ rows: 2, expandable: false }}>
                  {item.intro}
                </Paragraph>
              </div>
            </div>
          </Card>
        </List.Item>
      )}
    />
  );
};
export default Widget;
