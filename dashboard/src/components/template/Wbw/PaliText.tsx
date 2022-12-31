import { useEffect, useState } from "react";
import { useAppSelector } from "../../../hooks";
import { settingInfo } from "../../../reducers/setting";
import { GetUserSetting } from "../../auth/setting/default";
import { TCodeConvertor } from "../utilities";
import { roman_to_my, my_to_roman } from "../../code/my";
import { roman_to_si } from "../../code/si";
import { roman_to_thai } from "../../code/thai";
import { roman_to_taitham } from "../../code/tai-tham";

interface IWidget {
  text?: string;
  primary?: boolean;
}
const Widget = ({ text, primary = true }: IWidget) => {
  const [paliText, setPaliText] = useState(text);
  const settings = useAppSelector(settingInfo);
  useEffect(() => {
    const _paliCode1 = GetUserSetting("setting.pali.script.primary", settings);
    if (typeof _paliCode1 === "string") {
      const paliConvertor = _paliCode1 as TCodeConvertor;
      //编码转换

      switch (paliConvertor) {
        case "roman_to_my":
          setPaliText(roman_to_my(text));
          break;
        case "my_to_roman":
          setPaliText(my_to_roman(text));
          break;
        case "roman_to_si":
          setPaliText(roman_to_si(text));
          break;
        case "roman_to_thai":
          setPaliText(roman_to_thai(text));
          break;
        case "roman_to_taitham":
          setPaliText(roman_to_taitham(text));
          break;
        default:
          setPaliText(text);
          break;
      }
    }
  }, [settings]);
  return text ? <span>{paliText}</span> : <></>;
};

export default Widget;