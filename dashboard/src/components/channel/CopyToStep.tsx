import { Steps } from "antd";
import { useEffect, useState } from "react";

import { ArticleType } from "../article/Article";
import { IChannel } from "./Channel";
import ChannelPickerTable from "./ChannelPickerTable";
import ChannelSentDiff from "./ChannelSentDiff";
import CopyToResult from "./CopyToResult";

interface IWidget {
  initStep?: number;
  channel?: IChannel;
  type?: ArticleType;
  articleId?: string;
  sentence?: string[];
  stepChange?: Function;
  onClose?: Function;
}
const Widget = ({
  initStep = 0,
  channel,
  type,
  articleId,
  sentence,
  stepChange,
  onClose,
}: IWidget) => {
  const [current, setCurrent] = useState(0);
  const [destChannel, setDestChannel] = useState<IChannel>();
  const [copyPercent, setCopyPercent] = useState<number>();

  let sentList: string[] = [];
  const sentElement = document.querySelectorAll(".pcd_sent");
  for (let index = 0; index < sentElement.length; index++) {
    const element = sentElement[index];
    const id = element.id.split("_")[1];
    sentList.push(id);
  }
  useEffect(() => {
    setCurrent(initStep);
  }, [initStep]);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };
  const contentStyle: React.CSSProperties = {
    borderRadius: 5,
    border: `1px dashed gray`,
    marginTop: 16,
    height: 400,
    overflowY: "scroll",
  };
  const steps = [
    {
      title: "选择目标版本",
      key: "channel",
      content: (
        <div style={contentStyle}>
          <ChannelPickerTable
            type="editable"
            multiSelect={false}
            onSelect={(e: IChannel[]) => {
              console.log("channel", e);
              if (e.length > 0) {
                setDestChannel(e[0]);
                setCopyPercent(100);
                next();
              }
            }}
          />
        </div>
      ),
    },
    {
      title: "文本比对",
      key: "diff",
      content: (
        <ChannelSentDiff
          srcChannel={channel}
          destChannel={destChannel}
          sentences={sentList}
          goPrev={() => {
            prev();
          }}
          onSubmit={() => {
            next();
          }}
        />
      ),
    },
    {
      title: "完成",
      key: "finish",
      content: (
        <div style={contentStyle}>
          <CopyToResult
            onClose={() => {
              if (typeof onClose !== "undefined") {
                onClose();
              }
            }}
            onInit={() => {
              setCurrent(0);
            }}
          />
        </div>
      ),
    },
  ];
  const items = steps.map((item) => ({ key: item.key, title: item.title }));

  return (
    <div>
      <Steps current={current} items={items} percent={copyPercent} />
      {steps[current].content}
    </div>
  );
};

export default Widget;
