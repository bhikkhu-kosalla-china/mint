import { useEffect, useState } from "react";
import { NotificationIcon } from "../../assets/icon";
import { Badge, Popover } from "antd";
import { get } from "../../request";
import { INotificationListResponse } from "../api/notification";
import NotificationList from "./NotificationList";

const NotificationIconWidget = () => {
  const [count, setCount] = useState<number>();
  useEffect(() => {
    let timer = setInterval(() => {
      const url = `/v2/notification?view=to&status=unread&limit=1`;
      console.info("url", url);
      get<INotificationListResponse>(url).then((json) => {
        if (json.ok) {
          setCount(json.data.count);
          if (json.data.count > 0) {
            const newMessageTime = json.data.rows[0].created_at;
            const lastTime = localStorage.getItem("notification/new");
            if (lastTime === null || lastTime !== newMessageTime) {
              localStorage.setItem("notification/new", newMessageTime);
              if (window.Notification && Notification.permission !== "denied") {
                Notification.requestPermission(function (status) {
                  const notification = new Notification("通知标题", {
                    body: json.data.rows[0].content,
                    icon:
                      process.env.REACT_APP_API_HOST +
                      "/assets/images/wikipali_logo.png",
                    tag: json.data.rows[0].id,
                  });
                  notification.onclick = (event) => {
                    event.preventDefault(); // 阻止浏览器聚焦于 Notification 的标签页
                    window.open(json.data.rows[0].url, "_blank");
                  };
                });
              }
            }
          }
        }
      });
    }, 1000 * 60);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <>
      <Popover
        placement="bottomLeft"
        arrowPointAtCenter
        destroyTooltipOnHide
        content={
          <div style={{ width: 600 }}>
            <NotificationList onChange={(unread: number) => setCount(unread)} />
          </div>
        }
        trigger="click"
      >
        <Badge count={count} size="small">
          <span style={{ color: "white", cursor: "pointer" }}>
            <NotificationIcon />
          </span>
        </Badge>{" "}
      </Popover>
    </>
  );
};

export default NotificationIconWidget;
