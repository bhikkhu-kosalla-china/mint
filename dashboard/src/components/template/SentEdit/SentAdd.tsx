import { Button } from "antd";
import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";

import { IChannel } from "../../channel/Channel";
import ChannelTableModal from "../../channel/ChannelTableModal";

interface IWidget {
  onSelect?: Function;
}
const Widget = ({ onSelect }: IWidget) => {
  const [channelPickerOpen, setChannelPickerOpen] = useState(false);

  return (
    <ChannelTableModal
      trigger={
        <Button
          type="dashed"
          style={{ width: 300 }}
          icon={<PlusOutlined />}
          onClick={() => {
            setChannelPickerOpen(true);
          }}
        >
          Add
        </Button>
      }
      open={channelPickerOpen}
      onClose={() => setChannelPickerOpen(false)}
      onSelect={(channel: IChannel) => {
        setChannelPickerOpen(false);
        if (typeof onSelect !== "undefined") {
          onSelect(channel);
        }
      }}
    />
  );
};

export default Widget;
