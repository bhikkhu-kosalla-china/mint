import { useEffect, useState } from "react";
import { Popover, Typography } from "antd";
import {
  TagTwoTone,
  InfoCircleOutlined,
  CommentOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";

import "./wbw.css";
import WbwDetail from "./WbwDetail";
import { IWbw, TWbwDisplayMode } from "./WbwWord";
import { bookMarkColor } from "./WbwDetailBookMark";
import { PaliReal } from "../../../utils";
import WbwVideoButton from "./WbwVideoButton";
import CommentBox from "../../comment/CommentBox";
import PaliText from "./PaliText";
import store from "../../../store";
import { command } from "../../../reducers/command";
import { useAppSelector } from "../../../hooks";
import { add, relationAddParam } from "../../../reducers/relation-add";

const { Paragraph } = Typography;
interface IWidget {
  data: IWbw;
  display?: TWbwDisplayMode;
  onSave?: Function;
}
const WbwPaliWidget = ({ data, display, onSave }: IWidget) => {
  const [popOpen, setPopOpen] = useState(false);
  const [paliColor, setPaliColor] = useState("unset");
  const [isHover, setIsHover] = useState(false);
  const [hasComment, setHasComment] = useState(data.hasComment);
  /**
   * 处理 relation 链接事件
   * 点击连接或取消后，打开弹窗
   */
  const addParam = useAppSelector(relationAddParam);
  useEffect(() => {
    if (
      (addParam?.command === "apply" || addParam?.command === "cancel") &&
      addParam.src_sn === data.sn.join("-") &&
      addParam.book === data.book &&
      addParam.para === data.para
    ) {
      setPopOpen(true);
      store.dispatch(
        add({
          book: data.book,
          para: data.para,
          src_sn: data.sn.join("-"),
          command: "finish",
        })
      );
    }
  }, [
    addParam?.book,
    addParam?.command,
    addParam?.para,
    addParam?.src_sn,
    data.book,
    data.para,
    data.sn,
  ]);

  const handleClickChange = (open: boolean) => {
    if (open) {
      setPaliColor("lightblue");
    } else {
      setPaliColor("unset");
    }
    setPopOpen(open);
  };

  const wbwDetail = (
    <WbwDetail
      data={data}
      onClose={() => {
        setPaliColor("unset");
        setPopOpen(false);
      }}
      onSave={(e: IWbw) => {
        if (typeof onSave !== "undefined") {
          onSave(e);
          setPopOpen(false);
          setPaliColor("unset");
        }
      }}
    />
  );

  const noteIcon = data.note ? (
    <Popover content={data.note.value} placement="bottom">
      <InfoCircleOutlined style={{ color: "blue" }} />
    </Popover>
  ) : (
    <></>
  );
  const color = data.bookMarkColor
    ? bookMarkColor[data.bookMarkColor.value]
    : "white";

  //生成视频播放按钮
  const videoList = data.attachments?.filter((item) =>
    item.type?.includes("video")
  );
  const videoIcon = videoList ? (
    <WbwVideoButton
      video={videoList?.map((item) => {
        return {
          url: item.url ? item.url : "",
          type: item.type,
          title: item.name,
        };
      })}
    />
  ) : undefined;

  const relationIcon = data.relation ? (
    <ApartmentOutlined style={{ color: "blue" }} />
  ) : undefined;

  const bookMarkIcon = data.bookMarkText ? (
    <Popover
      content={<Paragraph copyable>{data.bookMarkText.value}</Paragraph>}
      placement="bottom"
    >
      <TagTwoTone twoToneColor={color} />
    </Popover>
  ) : (
    <></>
  );
  const classPali = data.style?.value === "note" ? "wbw_note" : "pali";
  let padding: string;
  if (typeof data.real !== "undefined" && PaliReal(data.real.value) !== "") {
    padding = "4px";
  } else {
    padding = "4px 0";
  }
  const paliWord = (
    <span
      className={classPali}
      style={{
        backgroundColor: paliColor,
        padding: padding,
        borderRadius: 5,
      }}
      onClick={() => {
        //发送点词查询消息

        store.dispatch(
          command({
            prop: {
              word: data.word.value,
            },
            type: "dict",
          })
        );
      }}
    >
      {<PaliText text={data.word.value} />}
    </span>
  );

  let commentShellStyle: React.CSSProperties = {
    display: "inline-block",
  };
  let commentIconStyle: React.CSSProperties = {
    cursor: "pointer",
  };

  if (display === "block") {
    commentIconStyle = {
      cursor: "pointer",
      visibility: isHover || hasComment ? "visible" : "hidden",
    };
  } else {
    if (!hasComment) {
      commentShellStyle = {
        display: "inline-block",
        position: "absolute",
        padding: 8,
        marginTop: "-1.5em",
        marginLeft: "-2em",
      };
      commentIconStyle = {
        visibility: "hidden",
        cursor: "pointer",
      };
    }
  }

  const discussionIcon = (
    <div style={commentShellStyle}>
      <CommentBox
        resId={data.uid}
        resType="wbw"
        trigger={<CommentOutlined style={commentIconStyle} />}
        onCommentCountChange={(count: number) => {
          if (count > 0) {
            setHasComment(true);
          } else {
            setHasComment(false);
          }
        }}
      />
    </div>
  );

  if (typeof data.real !== "undefined" && PaliReal(data.real.value) !== "") {
    //非标点符号
    return (
      <div
        className="pali_shell"
        onMouseEnter={() => {
          setIsHover(true);
        }}
        onMouseLeave={() => {
          setIsHover(false);
        }}
      >
        <Popover
          content={wbwDetail}
          placement="bottom"
          trigger="click"
          open={popOpen}
          onOpenChange={handleClickChange}
        >
          {paliWord}
        </Popover>
        {videoIcon}
        {noteIcon}
        {bookMarkIcon}
        {relationIcon}
        {discussionIcon}
      </div>
    );
  } else {
    //标点符号
    return (
      <div className="pali_shell" style={{ cursor: "unset" }}>
        {paliWord}
      </div>
    );
  }
};

export default WbwPaliWidget;
