import {
  Button,
  Card,
  Dropdown,
  Menu,
  Space,
  Segmented,
  Popover,
  Tabs,
} from "antd";
import {
  MoreOutlined,
  MenuOutlined,
  ReloadOutlined,
  PushpinOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import ArticleView, { IWidgetArticleData } from "./ArticleView";
import { useIntl } from "react-intl";
import { useState } from "react";
import { callbackify } from "util";

interface IWidgetArticleCard {
  data?: IWidgetArticleData;
  showModeSwitch?: boolean;
  showMainMenu?: boolean;
  showContextMenu?: boolean;
  showResTab?: boolean;
  children?: React.ReactNode;
  onModeChange?: Function;
  openInCol?: Function;
}
const Widget = ({ data, children, onModeChange }: IWidgetArticleCard) => {
  const intl = useIntl();
  const [mode, setMode] = useState<string>("read");

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
  };

  const menu = (
    <Menu
      onClick={onClick}
      items={[
        {
          key: "close",
          label: "关闭",
        },
      ]}
    />
  );
  const modeSwitch = (
    <Segmented
      size="middle"
      options={[
        {
          label: intl.formatMessage({ id: "buttons.read" }),
          value: "read",
        },
        {
          label: intl.formatMessage({ id: "buttons.edit" }),
          value: "edit",
        },
      ]}
      value={mode}
      onChange={(value) => {
        if (typeof onModeChange !== "undefined") {
          onModeChange(value.toString());
        }
        setMode(value.toString());
      }}
    />
  );

  const mainMenuContent = (
    <Tabs
      size="small"
      defaultActiveKey="1"
      tabBarExtraContent={{
        right: <Button type="text" size="small" icon={<PushpinOutlined />} />,
      }}
      items={[
        {
          label: `目录`,
          key: "1",
          children: `Content of Tab Pane 1`,
        },
        {
          label: `定位`,
          key: "2",
          children: `Content of Tab Pane 2`,
        },
        {
          label: `搜索`,
          key: "3",
          children: `Content of Tab Pane 3`,
        },
      ]}
    />
  );
  const mainMenu = (
    <Popover
      placement="bottomLeft"
      arrowPointAtCenter
      content={mainMenuContent}
      trigger="click"
    >
      <Button size="small" icon={<MenuOutlined />} />
    </Popover>
  );
  const contextMenu = (
    <Dropdown overlay={menu} placement="bottomRight">
      <Button shape="circle" size="small" icon={<MoreOutlined />}></Button>
    </Dropdown>
  );
  return (
    <Card
      size="small"
      title={
        <Space>
          {mainMenu}
          {data?.title}
        </Space>
      }
      extra={
        <Space>
          {modeSwitch}
          <Button
            shape="circle"
            size="small"
            icon={<ReloadOutlined />}
          ></Button>
          {contextMenu}
        </Space>
      }
      bodyStyle={{ height: `calc(100vh-50px)`, overflowY: "scroll" }}
    >
      {children}
    </Card>
  );
};

export default Widget;
