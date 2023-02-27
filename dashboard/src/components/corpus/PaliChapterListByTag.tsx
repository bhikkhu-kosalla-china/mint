import { useState, useEffect } from "react";

import { get } from "../../request";
import { IApiResponsePaliChapterList } from "../api/Corpus";
import { IPaliChapterData } from "./PaliChapterCard";
import PaliChapterList, { IChapterClickEvent } from "./PaliChapterList";

interface IWidgetPaliChapterListByTag {
  tag: string[];
  onChapterClick?: Function;
}
const defaultData: IPaliChapterData[] = [];
const Widget = (prop: IWidgetPaliChapterListByTag) => {
  const [tableData, setTableData] = useState(defaultData);

  useEffect(() => {
    console.log("palichapterlist useEffect");
    let url = `/v2/palitext?view=chapter&tags=${prop.tag.join()}`;
    console.log("tag url", url);
    get(url).then(function (myJson) {
      console.log("ajex", myJson);
      const data = myJson as unknown as IApiResponsePaliChapterList;
      let newTree: IPaliChapterData[] = data.data.rows.map((item) => {
        return {
          Title: item.title,
          PaliTitle: item.title,
          level: item.level,
          Path: item.path,
          Book: item.book,
          Paragraph: item.paragraph,
        };
      });
      setTableData(newTree);
    });
  }, [prop.tag]);

  return (
    <>
      <PaliChapterList
        data={tableData}
        maxLevel={1}
        onChapterClick={(e: IChapterClickEvent) => {
          if (typeof prop.onChapterClick !== "undefined") {
            prop.onChapterClick(e);
          }
        }}
      />
    </>
  );
};

export default Widget;
