import { Space, Tooltip } from "antd";
import { useIntl } from "react-intl";
import { FieldTimeOutlined } from "@ant-design/icons";

interface IWidgetTimeShow {
  showIcon?: boolean;
  showTitle?: boolean;
  showTooltip?: boolean;
  time?: string;
  title: string;
}

const Widget = ({
  showIcon = true,
  showTitle = false,
  showTooltip = true,
  time,
  title,
}: IWidgetTimeShow) => {
  const intl = useIntl(); //i18n
  if (typeof time === "undefined") {
    return <></>;
  }
  const icon = showIcon ? <FieldTimeOutlined /> : <></>;
  const strTitle = showTitle ? title : "";

  const passTime: string = getPassDataTime(time);
  const tooltip: string = getFullDataTime(time);
  const color = "lime";
  function getPassDataTime(t: string): string {
    let currDate = new Date();
    const time = new Date(t);
    let pass = currDate.getTime() - time.getTime();
    let strPassTime = "";
    if (pass < 120 * 1000) {
      //二分钟内
      strPassTime =
        Math.floor(pass / 1000) +
        intl.formatMessage({ id: "utilities.time.secs_ago" });
    } else if (pass < 7200 * 1000) {
      //二小时内
      strPassTime =
        Math.floor(pass / 1000 / 60) +
        intl.formatMessage({ id: "utilities.time.mins_ago" });
    } else if (pass < 3600 * 48 * 1000) {
      //二天内
      strPassTime =
        Math.floor(pass / 1000 / 3600) +
        intl.formatMessage({ id: "utilities.time.hs_ago" });
    } else if (pass < 3600 * 24 * 14 * 1000) {
      //二周内
      strPassTime =
        Math.floor(pass / 1000 / 3600 / 24) +
        intl.formatMessage({ id: "utilities.time.days_ago" });
    } else if (pass < 3600 * 24 * 60 * 1000) {
      //二个月内
      strPassTime =
        Math.floor(pass / 1000 / 3600 / 24 / 7) +
        intl.formatMessage({ id: "utilities.time.weeks_ago" });
    } else if (pass < 3600 * 24 * 365 * 1000) {
      //一年内
      strPassTime =
        Math.floor(pass / 1000 / 3600 / 24 / 30) +
        intl.formatMessage({ id: "utilities.time.months_ago" });
    } else if (pass < 3600 * 24 * 730 * 1000) {
      //超过1年小于2年
      strPassTime =
        Math.floor(pass / 1000 / 3600 / 24 / 365) +
        intl.formatMessage({ id: "utilities.time.year_ago" });
    } else {
      strPassTime =
        Math.floor(pass / 1000 / 3600 / 24 / 365) +
        intl.formatMessage({ id: "utilities.time.years_ago" });
    }
    return strPassTime;
  }
  function getFullDataTime(t: string) {
    let inputDate = new Date(t);
    return inputDate.toLocaleString();
  }

  return (
    <Tooltip title={tooltip} color={color} key={color}>
      <Space>
        {icon}
        {strTitle}
        {passTime}
      </Space>
    </Tooltip>
  );
};

export default Widget;
