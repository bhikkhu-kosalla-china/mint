import { useEffect, useRef, useState } from "react";
import { Typography } from "antd";

import { useAppSelector } from "../../hooks";
import {
  onChangeKey,
  onChangeValue,
  settingInfo,
} from "../../reducers/setting";
import { GetUserSetting } from "../auth/setting/default";
import { TCodeConvertor } from "./utilities";
import { ISentence } from "./SentEdit";
import MdView from "./MdView";
import store from "../../store";
import { push } from "../../reducers/sentence";
const { Text } = Typography;

interface IWidgetSentReadFrame {
  origin?: ISentence[];
  translation?: ISentence[];
  layout?: "row" | "column";
  book?: number;
  para?: number;
  wordStart?: number;
  wordEnd?: number;
  sentId?: string;
  error?: string;
}
const SentReadFrame = ({
  origin,
  translation,
  layout = "column",
  book,
  para,
  wordStart,
  wordEnd,
  sentId,
  error,
}: IWidgetSentReadFrame) => {
  const [paliCode1, setPaliCode1] = useState<TCodeConvertor>("roman");
  const key = useAppSelector(onChangeKey);
  const value = useAppSelector(onChangeValue);
  const settings = useAppSelector(settingInfo);
  const boxOrg = useRef<HTMLDivElement>(null);
  const boxSent = useRef<HTMLDivElement>(null);
  useEffect(() => {
    store.dispatch(
      push({
        id: `${book}-${para}-${wordStart}-${wordEnd}`,
        origin: origin?.map((item) => item.html),
        translation: translation?.map((item) => item.html),
      })
    );
  }, []);

  useEffect(() => {
    const displayOriginal = GetUserSetting(
      "setting.display.original",
      settings
    );
    if (typeof displayOriginal === "boolean") {
      if (boxOrg.current) {
        if (displayOriginal === true) {
          boxOrg.current.style.display = "block";
        } else {
          boxOrg.current.style.display = "none";
        }
      }
    }
    const layoutDirection = GetUserSetting(
      "setting.layout.direction",
      settings
    );
    if (typeof layoutDirection === "string") {
      if (boxSent.current) {
        boxSent.current.style.flexDirection = layoutDirection;
      }
    }

    const _paliCode1 = GetUserSetting("setting.pali.script.primary", settings);
    if (typeof _paliCode1 !== "undefined") {
      setPaliCode1(_paliCode1.toString() as TCodeConvertor);
    }
  }, [key, value, settings]);
  return (
    <div
      style={{ display: "flex", flexDirection: layout, marginBottom: 10 }}
      ref={boxSent}
    >
      <Text type="danger" mark>
        {error}
      </Text>
      <div
        dangerouslySetInnerHTML={{
          __html: `<div class="pcd_sent" id="sent_${book}-${para}-${wordStart}-${wordEnd}"></div>`,
        }}
      />
      <div style={{ flex: "5", color: "#9f3a01" }} ref={boxOrg}>
        {origin?.map((item, id) => {
          return (
            <Text key={id}>
              <MdView
                style={{ color: "brown" }}
                html={item.html}
                wordWidget={true}
                convertor={paliCode1}
              />
            </Text>
          );
        })}
      </div>
      <div style={{ flex: "5" }}>
        {translation?.map((item, id) => {
          return (
            <Text key={id}>
              <MdView html={item.html} />
            </Text>
          );
        })}
      </div>
    </div>
  );
};

interface IWidget {
  props: string;
}
const Widget = ({ props }: IWidget) => {
  const prop = JSON.parse(atob(props)) as IWidgetSentReadFrame;
  return (
    <>
      <SentReadFrame {...prop} />
    </>
  );
};

export default Widget;
