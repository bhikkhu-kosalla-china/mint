import { Typography, Divider, Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

import MdView from "../template/MdView";
import TocPath, { ITocPathNode } from "../corpus/TocPath";
import PaliChapterChannelList from "../corpus/PaliChapterChannelList";
import { ArticleType } from "./Article";

const { Paragraph, Title, Text } = Typography;

export interface IWidgetArticleData {
  id?: string;
  title?: string;
  subTitle?: string;
  summary?: string;
  content?: string;
  html?: string;
  path?: ITocPathNode[];
  created_at?: string;
  updated_at?: string;
  channels?: string[];
  type?: ArticleType;
  articleId?: string;
}

const Widget = ({
  id,
  title = "",
  subTitle,
  summary,
  content,
  html,
  path = [],
  created_at,
  updated_at,
  channels,
  type,
  articleId,
}: IWidgetArticleData) => {
  let currChannelList = <></>;
  switch (type) {
    case "chapter":
      const chapterProps = articleId?.split("_");
      if (typeof chapterProps === "object" && chapterProps.length > 0) {
        const para = chapterProps[0].split("-");
        const channels =
          chapterProps.length > 1 ? chapterProps.slice(1) : undefined;
        if (typeof para === "object" && para.length > 1) {
          currChannelList = (
            <PaliChapterChannelList
              para={{ book: parseInt(para[0]), para: parseInt(para[1]) }}
              channelId={channels}
              openTarget="_self"
            />
          );
        }
      }

      break;

    default:
      break;
  }
  return (
    <>
      <Button shape="round" size="small" icon={<ReloadOutlined />}>
        刷新
      </Button>
      <div>
        <TocPath data={path} channel={channels} />

        <Title level={4}>
          <div
            dangerouslySetInnerHTML={{
              __html: title ? title : "",
            }}
          />
        </Title>
        <Text type="secondary">{subTitle}</Text>
        {currChannelList}
        <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: "more" }}>
          {summary}
        </Paragraph>
        <Divider />
      </div>
      <div>
        <MdView html={html ? html : content} />
      </div>
    </>
  );
};

export default Widget;
