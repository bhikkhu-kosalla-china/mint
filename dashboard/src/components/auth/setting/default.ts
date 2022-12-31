import { ISettingItem } from "../../../reducers/setting";

export interface ISettingItemOption {
  label: string;
  value: string;
}
export interface ISetting {
  key: string;
  label: string;
  description: string;
  defaultValue: string | number | boolean;
  value?: string | number | boolean;
  widget?: "input" | "select" | "radio" | "radio-button";
  options?: ISettingItemOption[];
  max?: number;
  min?: number;
}

export const GetUserSetting = (
  key: string,
  curr?: ISettingItem[]
): string | number | boolean | undefined => {
  const currSetting = curr?.find((element) => element.key === key);
  if (typeof currSetting !== "undefined") {
    return currSetting.value;
  } else {
    const defaultSetting = SettingFind(key);
    if (typeof defaultSetting !== "undefined") {
      return defaultSetting.defaultValue;
    } else {
      return undefined;
    }
  }
};

export const SettingFind = (key: string): ISetting | undefined => {
  return defaultSetting.find((element) => element.key === key);
};

export const defaultSetting: ISetting[] = [
  {
    /**
     * 是否显示巴利原文
     */
    key: "setting.display.original",
    label: "setting.display.original.label",
    description: "setting.display.original.description",
    defaultValue: true,
  },
  {
    /**
     * 排版方向
     */
    key: "setting.layout.direction",
    label: "setting.layout.direction.label",
    description: "setting.layout.direction.description",
    defaultValue: "column",
    options: [
      {
        value: "column",
        label: "setting.layout.direction.col.label",
      },
      {
        value: "row",
        label: "setting.layout.direction.row.label",
      },
    ],
    widget: "radio-button",
  },
  {
    /**
     * 段落或者逐句对读
     */
    key: "setting.layout.paragraph",
    label: "setting.layout.paragraph.label",
    description: "setting.layout.paragraph.description",
    defaultValue: "sentence",
    options: [
      {
        value: "sentence",
        label: "setting.layout.paragraph.sentence.label",
      },
      {
        value: "paragraph",
        label: "setting.layout.paragraph.paragraph.label",
      },
    ],
    widget: "radio-button",
  },
  {
    /**
     * 第一巴利脚本
     */
    key: "setting.pali.script.primary",
    label: "setting.pali.script.primary.label",
    description: "setting.pali.script.primary.description",
    defaultValue: "roman",
    options: [
      {
        value: "roman",
        label: "setting.pali.script.rome.label",
      },
      {
        value: "roman_to_my",
        label: "setting.pali.script.my.label",
      },
      {
        value: "roman_to_si",
        label: "setting.pali.script.si.label",
      },
      {
        value: "roman_to_thai",
        label: "setting.pali.script.thai.label",
      },
      {
        value: "roman_to_taitham",
        label: "setting.pali.script.tai.label",
      },
    ],
  },
  {
    /**
     * 第二巴利脚本
     */
    key: "setting.pali.script.secondary",
    label: "setting.pali.script.secondary.label",
    description: "setting.pali.script.secondary.description",
    defaultValue: "none",
    options: [
      {
        value: "none",
        label: "setting.pali.script.none.label",
      },
      {
        value: "roman",
        label: "setting.pali.script.rome.label",
      },
      {
        value: "roman_to_my",
        label: "setting.pali.script.my.label",
      },
      {
        value: "roman_to_si",
        label: "setting.pali.script.si.label",
      },
    ],
  },
];