import { useState } from "react";

import { command, lookup } from "../../reducers/command";
import store from "../../store";
import { IWidgetDict } from "../dict/DictComponent";

interface IWidgetWdCtl {
  text?: string;
}
export const WdCtl = ({ text }: IWidgetWdCtl) => {
  const [isHover, setIsHover] = useState(false);
  return (
    <span
      onMouseEnter={() => {
        setIsHover(true);
      }}
      onMouseLeave={() => {
        setIsHover(false);
      }}
      onClick={() => {
        //发送点词查询消息
        store.dispatch(lookup(text));
      }}
      style={{
        textDecoration: isHover ? "underline dotted" : "none",
        textUnderlineOffset: 4,
        cursor: "pointer",
      }}
    >
      {text}{" "}
    </span>
  );
};

interface IWidgetTerm {
  props: string;
}
const WdWidget = ({ props }: IWidgetTerm) => {
  const prop = JSON.parse(atob(props)) as IWidgetWdCtl;
  return <WdCtl {...prop} />;
};

export default WdWidget;
