import { message } from "antd";
import { useEffect, useState } from "react";
import { modeChange } from "../../reducers/article-mode";

import { get } from "../../request";
import store from "../../store";
import { IArticleDataResponse, IArticleResponse } from "../api/Article";
import ArticleView from "./ArticleView";

export type ArticleMode = "read" | "edit" | "wbw";
export type ArticleType =
  | "article"
  | "chapter"
  | "paragraph"
  | "cs-paragraph"
  | "sentence"
  | "sim"
  | "page";
interface IWidgetArticle {
  type?: string;
  articleId?: string;
  mode?: ArticleMode;
  active?: boolean;
}
const Widget = ({
  type,
  articleId,
  mode = "read",
  active = false,
}: IWidgetArticle) => {
  const [articleData, setArticleData] = useState<IArticleDataResponse>();
  const [articleMode, setArticleMode] = useState<ArticleMode>(mode);

  let channels: string[] = [];
  if (typeof articleId !== "undefined") {
    const aId = articleId.split("_");
    if (aId.length > 1) {
      channels = aId.slice(1);
    }
  }

  useEffect(() => {
    console.log("mode", mode, articleMode);
    if (!active) {
      return;
    }
    setArticleMode(mode);
    //发布mode变更
    store.dispatch(modeChange(mode));

    if (mode !== articleMode && mode !== "read" && articleMode !== "read") {
      console.log("set mode", mode, articleMode);
      return;
    }

    if (typeof type !== "undefined" && typeof articleId !== "undefined") {
      let url = "";
      switch (type) {
        case "corpus/article":
          url = `/v2/article/${articleId}?mode=${mode}`;
          break;
        case "corpus/textbook":
          url = `/v2/article/${mode}?mode=read`;
          break;
        default:
          url = `/v2/${type}/${articleId}/${mode}`;
          break;
      }
      get<IArticleResponse>(url).then((json) => {
        console.log("article", json);
        if (json.ok) {
          setArticleData(json.data);
        } else {
          message.error(json.message);
        }
      });
    }
  }, [active, type, articleId, mode, articleMode]);

  return (
    <ArticleView
      id={articleData?.uid}
      title={articleData?.title}
      subTitle={articleData?.subtitle}
      summary={articleData?.summary}
      content={articleData ? articleData.content : ""}
      html={articleData?.html}
      path={articleData?.path}
      created_at={articleData?.created_at}
      updated_at={articleData?.updated_at}
      channels={channels}
    />
  );
};

export default Widget;
