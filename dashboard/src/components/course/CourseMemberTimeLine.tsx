import { useEffect, useRef } from "react";
import { useIntl } from "react-intl";
import { Space, Tag } from "antd";
import { ActionType, ProList } from "@ant-design/pro-components";

import { get } from "../../request";
import { ICourseMemberData, ICourseMemberListResponse } from "../api/Course";
import User from "../auth/User";
import TimeShow from "../general/TimeShow";
import { getStatusColor } from "./RolePower";

interface IWidget {
  courseId?: string;
  userId?: string;
}

const CourseMemberTimeLineWidget = ({ courseId, userId }: IWidget) => {
  const intl = useIntl(); //i18n

  const ref = useRef<ActionType>();

  useEffect(() => {
    ref.current?.reload();
  }, [courseId, userId]);

  return (
    <>
      <ProList<ICourseMemberData>
        actionRef={ref}
        search={{
          filterType: "light",
        }}
        metas={{
          title: {
            dataIndex: "name",
            search: false,
            render(dom, entity, index, action, schema) {
              return entity.user?.nickName;
            },
          },
          avatar: {
            render(dom, entity, index, action, schema) {
              return <User {...entity.user} showName={false} />;
            },
            editable: false,
          },
          description: {
            dataIndex: "desc",
            search: false,
            render(dom, entity, index, action, schema) {
              return (
                <Space>
                  <User {...entity.editor} showAvatar={false} />
                  <TimeShow type="secondary" updatedAt={entity.updated_at} />
                </Space>
              );
            },
          },
          subTitle: {
            search: false,
            render: (
              dom: React.ReactNode,
              entity: ICourseMemberData,
              index: number
            ) => {
              return (
                <Tag>
                  {intl.formatMessage({
                    id: `auth.role.${entity.role}`,
                  })}
                </Tag>
              );
            },
          },
          actions: {
            search: false,
            render: (text, row, index, action) => {
              const statusColor = getStatusColor(row.status);
              return [
                <span style={{ color: statusColor }}>
                  {intl.formatMessage({
                    id: `course.member.status.${row.status}.label`,
                  })}
                </span>,
              ];
            },
          },
        }}
        request={async (params = {}, sorter, filter) => {
          console.log(params, sorter, filter);

          let url = `/v2/course-member?view=timeline&course=${courseId}&userId=${userId}`;
          const offset =
            ((params.current ? params.current : 1) - 1) *
            (params.pageSize ? params.pageSize : 20);
          url += `&limit=${params.pageSize}&offset=${offset}`;
          if (typeof params.keyword !== "undefined") {
            url += "&search=" + (params.keyword ? params.keyword : "");
          }
          console.info("api request", url);
          const res = await get<ICourseMemberListResponse>(url);
          if (res.ok) {
            console.debug("api response", res.data);
            return {
              total: res.data.count,
              succcess: true,
              data: res.data.rows,
            };
          } else {
            console.error(res.message);
            return {
              total: 0,
              succcess: false,
              data: [],
            };
          }
        }}
        rowKey="id"
        bordered
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
        }}
        options={{
          search: false,
        }}
      />
    </>
  );
};

export default CourseMemberTimeLineWidget;
