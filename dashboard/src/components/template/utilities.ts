import React from "react";

import MdTpl from "./MdTpl";
import { WdCtl } from "./Wd";
import { Divider } from "antd";
import { roman_to_my, my_to_roman } from "../code/my";
import { roman_to_si } from "../code/si";
import { roman_to_thai } from "../code/thai";
import { roman_to_taitham } from "../code/tai-tham";

export type TCodeConvertor =
  | "none"
  | "roman"
  | "roman_to_my"
  | "my_to_roman"
  | "roman_to_thai"
  | "roman_to_taitham"
  | "roman_to_si";
export function XmlToReact(
  text: string,
  wordWidget: boolean = false,
  convertor?: TCodeConvertor
): React.ReactNode[] {
  //console.log("html string:", text);
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(
    "<root><root>" + text + "</root></root>",
    "text/xml"
  );
  const x = xmlDoc.documentElement.childNodes;
  return convert(x[0], wordWidget, convertor);

  function getAttr(node: ChildNode, key: number): Object {
    const ele = node as Element;
    const attr = ele.attributes;
    let output: any = { key: key };
    for (let i = 0; i < attr.length; i++) {
      if (attr[i].nodeType === 2) {
        let key: string = attr[i].nodeName;
        output[key] = attr[i].nodeValue;
      }
    }
    return output;
  }

  function convert(
    node: ChildNode,
    wordWidget: boolean = false,
    convertor?: TCodeConvertor
  ): React.ReactNode[] {
    let output: React.ReactNode[] = [];
    for (let i = 0; i < node.childNodes.length; i++) {
      const value = node.childNodes[i];
      //console.log(value.nodeName, value.nodeType, value.nodeValue);

      switch (value.nodeType) {
        case 1: //element node
          switch (value.nodeName) {
            case "MdTpl":
              output.push(
                React.createElement(
                  MdTpl,
                  getAttr(value, i),
                  convert(value, wordWidget, convertor)
                )
              );
              break;
            case "hr":
              output.push(
                React.createElement(
                  Divider,
                  getAttr(value, i),
                  convert(value, wordWidget, convertor)
                )
              );
              break;
            default:
              output.push(
                React.createElement(
                  value.nodeName,
                  getAttr(value, i),
                  convert(value, wordWidget, convertor)
                )
              );
              break;
          }

          break;
        case 2: //attribute node
          return [];
        case 3: //text node
          let textValue = value.nodeValue;
          //编码转换
          if (typeof convertor !== "undefined") {
            switch (convertor) {
              case "roman_to_my":
                textValue = roman_to_my(textValue);
                break;
              case "my_to_roman":
                textValue = my_to_roman(textValue);
                break;
              case "roman_to_si":
                textValue = roman_to_si(textValue);
                break;
              case "roman_to_thai":
                textValue = roman_to_thai(textValue);
                break;
              case "roman_to_taitham":
                textValue = roman_to_taitham(textValue);
                break;
            }
          }
          if (wordWidget) {
            //将单词按照空格拆开。用组件包裹
            const wordList = textValue?.split(" ");
            const wordWidget = wordList?.map((word, id) => {
              const prop: any = { key: id, text: word };
              return React.createElement(WdCtl, prop);
            });
            output.push(wordWidget);
          } else {
            output.push(textValue);
          }

          break;
        case 8:
          return [];
        case 9:
          return [];
      }
    }
    return output;
  }
}
