import { useEffect, useState } from "react";
import { Divider, message, Result, Tag } from "antd";

import { get, post } from "../../request";
import store from "../../store";
import { IArticleDataResponse, IArticleResponse } from "../api/Article";
import ArticleView from "./ArticleView";
import { ICourseCurrUserResponse } from "../api/Course";
import { ICourseUser, signIn } from "../../reducers/course-user";
import { ITextbook, refresh } from "../../reducers/current-course";
import ExerciseList from "./ExerciseList";
import ExerciseAnswer from "../course/ExerciseAnswer";
import "./article.css";
import CommentListCard from "../comment/CommentListCard";
import TocTree from "./TocTree";
import PaliText from "../template/Wbw/PaliText";
import ArticleSkeleton from "./ArticleSkeleton";

import { modeChange } from "../../reducers/article-mode";
import { IViewRequest, IViewStoreResponse } from "../api/view";
import {
  IRecentRequest,
  IRecentResponse,
} from "../../pages/studio/recent/list";

export type ArticleMode = "read" | "edit" | "wbw";
export type ArticleType =
  | "article"
  | "chapter"
  | "para"
  | "cs-para"
  | "sent"
  | "sim"
  | "page"
  | "textbook"
  | "exercise"
  | "exercise-list"
  | "sent-original"
  | "sent-commentary"
  | "sent-nissaya"
  | "sent-translation"
  | "term";
/**
 * 每种article type 对应的路由参数
 * article/id?anthology=id&channel=id1,id2&mode=ArticleMode
 * chapter/book-para?channel=id1,id2&mode=ArticleMode
 * para/book?par=para1,para2&channel=id1,id2&mode=ArticleMode
 * cs-para/book-para?channel=id1,id2&mode=ArticleMode
 * sent/id?channel=id1,id2&mode=ArticleMode
 * sim/id?channel=id1,id2&mode=ArticleMode
 * textbook/articleId?course=id&mode=ArticleMode
 * exercise/articleId?course=id&exercise=id&username=name&mode=ArticleMode
 * exercise-list/articleId?course=id&exercise=id&mode=ArticleMode
 * sent-original/id
 */
interface IWidgetArticle {
  type?: ArticleType;
  id?: string;
  book?: string | null;
  para?: string | null;
  channelId?: string | null;
  articleId?: string;
  anthologyId?: string;
  courseId?: string;
  exerciseId?: string;
  userName?: string;
  mode?: ArticleMode | null;
  active?: boolean;
  onArticleChange?: Function;
  onFinal?: Function;
  onLoad?: Function;
}
const ArticleWidget = ({
  type,
  id,
  book,
  para,
  channelId,
  articleId,
  anthologyId,
  courseId,
  exerciseId,
  userName,
  mode = "read",
  active = false,
  onArticleChange,
  onFinal,
  onLoad,
}: IWidgetArticle) => {
  const [articleData, setArticleData] = useState<IArticleDataResponse>();
  const [articleHtml, setArticleHtml] = useState<string[]>(["<span />"]);
  const [extra, setExtra] = useState(<></>);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [remains, setRemains] = useState(false);

  const channels = channelId?.split("_");

  useEffect(() => {
    /**
     * 由课本进入查询当前用户的权限和channel
     */
    if (
      type === "textbook" ||
      type === "exercise" ||
      type === "exercise-list"
    ) {
      if (typeof articleId !== "undefined") {
        const id = articleId.split("_");
        get<ICourseCurrUserResponse>(`/v2/course-curr?course_id=${id[0]}`).then(
          (response) => {
            console.log("course user", response);
            if (response.ok) {
              const it: ICourseUser = {
                channelId: response.data.channel_id,
                role: response.data.role,
              };
              store.dispatch(signIn(it));
              /**
               * redux发布课程信息
               */
              const ic: ITextbook = {
                courseId: id[0],
                articleId: id[1],
              };
              store.dispatch(refresh(ic));
            }
          }
        );
      }
    }
  }, [articleId, type]);

  useEffect(() => {
    //发布mode变更
    console.log("发布mode变更", mode);
    store.dispatch(modeChange(mode as ArticleMode));
  }, [mode]);

  const srcDataMode = mode === "edit" || mode === "wbw" ? "edit" : "read";
  useEffect(() => {
    console.log("srcDataMode", srcDataMode);
    if (!active) {
      return;
    }
    if (typeof type !== "undefined") {
      let url = "";
      switch (type) {
        case "chapter":
          if (typeof articleId !== "undefined") {
            url = `/v2/corpus-chapter/${articleId}?mode=${srcDataMode}`;
            url += channelId ? `&channels=${channelId}` : "";
          }
          break;
        case "para":
          const _book = book ? book : articleId;
          url = `/v2/corpus?view=para&book=${_book}&par=${para}&mode=${srcDataMode}`;
          url += channelId ? `&channels=${channelId}` : "";
          break;
        case "article":
          if (typeof articleId !== "undefined") {
            url = `/v2/article/${articleId}?mode=${srcDataMode}`;
            url += channelId ? `&channel=${channelId}` : "";
            url += anthologyId ? `&anthology=${anthologyId}` : "";
          }
          break;
        case "textbook":
          if (typeof articleId !== "undefined") {
            url = `/v2/article/${articleId}?view=textbook&course=${courseId}&mode=${srcDataMode}`;
          }
          break;
        case "exercise":
          if (typeof articleId !== "undefined") {
            url = `/v2/article/${articleId}?mode=${srcDataMode}&course=${courseId}&exercise=${exerciseId}&user=${userName}`;
            setExtra(
              <ExerciseAnswer
                courseId={courseId}
                articleId={articleId}
                exerciseId={exerciseId}
              />
            );
          }
          break;
        case "exercise-list":
          if (typeof articleId !== "undefined") {
            url = `/v2/article/${articleId}?mode=${srcDataMode}&course=${courseId}&exercise=${exerciseId}`;

            setExtra(
              <ExerciseList
                courseId={courseId}
                articleId={articleId}
                exerciseId={exerciseId}
              />
            );
          }
          break;
        default:
          if (typeof articleId !== "undefined") {
            url = `/v2/corpus/${type}/${articleId}/${srcDataMode}?mode=${srcDataMode}`;
            url += channelId ? `&channel=${channelId}` : "";
          }
          break;
      }
      console.log("article url", url);
      setShowSkeleton(true);
      if (typeof articleId !== "undefined") {
        const param = {
          mode: srcDataMode,
          channel: channelId !== null ? channelId : undefined,
          book: book !== null ? book : undefined,
          para: para !== null ? para : undefined,
        };
        post<IRecentRequest, IRecentResponse>("/v2/recent", {
          type: type,
          article_id: articleId,
          param: JSON.stringify(param),
        }).then((json) => {
          console.log("recent", json);
        });
      }

      get<IArticleResponse>(url)
        .then((json) => {
          console.log("article", json);
          if (json.ok) {
            setArticleData(json.data);
            if (json.data.content) {
              setArticleHtml([json.data.content]);
            }
            if (json.data.from) {
              setRemains(true);
            }
            setShowSkeleton(false);

            setExtra(
              <TocTree
                treeData={json.data.toc?.map((item) => {
                  const strTitle = item.title ? item.title : item.pali_title;
                  const progress = item.progress?.map((item, id) => (
                    <Tag key={id}>{Math.round(item * 100)}</Tag>
                  ));

                  return {
                    key: `${item.book}-${item.paragraph}`,
                    title: (
                      <>
                        <PaliText text={strTitle} />
                        {progress}
                      </>
                    ),
                    level: item.level,
                  };
                })}
                onSelect={(keys: string[]) => {
                  console.log(keys);
                  if (
                    typeof onArticleChange !== "undefined" &&
                    keys.length > 0
                  ) {
                    onArticleChange(keys[0]);
                  }
                }}
              />
            );

            switch (type) {
              case "chapter":
                if (typeof articleId === "string" && channelId) {
                  const [book, para] = articleId?.split("-");
                  post<IViewRequest, IViewStoreResponse>("/v2/view", {
                    target_type: type,
                    book: parseInt(book),
                    para: parseInt(para),
                    channel: channelId,
                    mode: srcDataMode,
                  }).then((json) => {
                    console.log("view", json.data);
                  });
                }
                break;
              default:
                break;
            }

            if (typeof onLoad !== "undefined") {
              onLoad(json.data);
            }

            console.log("lazy load begin", json.data);
            //lazy load
            //getNextPara(json.data);
          } else {
            setShowSkeleton(false);
            setUnauthorized(true);
            message.error(json.message);
          }
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [
    active,
    type,
    articleId,
    srcDataMode,
    book,
    para,
    channelId,
    anthologyId,
    courseId,
    exerciseId,
    userName,
  ]);

  const getNextPara = (next: IArticleDataResponse): void => {
    if (
      typeof next.paraId === "undefined" ||
      typeof next.mode === "undefined" ||
      typeof next.from === "undefined" ||
      typeof next.to === "undefined"
    ) {
      setRemains(false);
      return;
    }
    let url = `/v2/corpus-chapter/${next.paraId}?mode=${next.mode}`;
    url += `&from=${next.from}`;
    url += `&to=${next.to}`;
    url += channels ? `&channels=${channels}` : "";
    console.log("lazy load", url);
    get<IArticleResponse>(url).then((json) => {
      if (json.ok) {
        if (typeof json.data.content === "string") {
          const content: string = json.data.content;
          setArticleData((origin) => {
            if (origin) {
              origin.from = json.data.from;
            }
            return origin;
          });
          setArticleHtml((origin) => {
            return [...origin, content];
          });
        }

        //getNextPara(json.data);
      }
    });
    return;
  };
  return (
    <div>
      {showSkeleton ? (
        <ArticleSkeleton />
      ) : unauthorized ? (
        <Result
          status="403"
          title="无权访问"
          subTitle="您无权访问该内容。您可能没有登录，或者内容的所有者没有给您所需的权限。"
          extra={<></>}
        />
      ) : (
        <ArticleView
          id={articleData?.uid}
          title={articleData?.title}
          subTitle={articleData?.subtitle}
          summary={articleData?.summary}
          content={articleData ? articleData.content : ""}
          html={articleHtml}
          path={articleData?.path}
          created_at={articleData?.created_at}
          updated_at={articleData?.updated_at}
          channels={channels}
          type={type}
          articleId={articleId}
          remains={remains}
          onEnd={() => {
            if (type === "chapter" && articleData) {
              getNextPara(articleData);
            }
          }}
        />
      )}

      {extra}
      <Divider />
      <CommentListCard resId={articleData?.uid} resType="article" />
    </div>
  );
};

export default ArticleWidget;
