import { AutoComplete, Badge, Input, Typography } from "antd";
import { SizeType } from "antd/lib/config-provider/SizeContext";
import { useState } from "react";
import { get } from "../../request";

const { Text } = Typography;

export interface IWordIndexData {
  word: string;
  count: number;
  bold: number;
}
export interface IWordIndexListResponse {
  ok: boolean;
  message: string;
  data: {
    rows: IWordIndexData[];
    count: number;
  };
}

interface ValueType {
  key?: string;
  label: React.ReactNode;
  value: string | number;
}
interface IWidget {
  value?: string;
  tags?: string[];
  book?: number;
  para?: number;
  size?: SizeType;
  width?: string | number;
  onSearch?: Function;
  onSplit?: Function;
}
const Widget = ({
  value,
  onSplit,
  tags,
  size = "middle",
  width,
  onSearch,
}: IWidget) => {
  const [options, setOptions] = useState<ValueType[]>([]);
  const [input, setInput] = useState<string | undefined>(value);

  const renderItem = (word: string, count: number, bold: number) => ({
    value: word,
    label: (
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>{bold > 0 ? <Text strong>{word}</Text> : word}</span>
          <Badge color="geekblue" count={count} />
        </div>
      </div>
    ),
  });
  const search = (value: string) => {
    console.log("search", value);
    if (value === "") {
      return;
    }

    get<IWordIndexListResponse>(
      `/v2/pali-word-index?view=key&key=${value}`
    ).then((json) => {
      const words: ValueType[] = json.data.rows.map((item) => {
        return renderItem(item.word, item.count, item.bold);
      });
      setOptions(words);
    });
  };
  return (
    <>
      <AutoComplete
        style={{ width: width }}
        value={input}
        popupClassName="certain-category-search-dropdown"
        dropdownMatchSelectWidth={400}
        options={options}
        onChange={(value: string, option: ValueType | ValueType[]) => {
          console.log("input", value);
          setInput(value);
        }}
        onSearch={(value: string) => {
          console.log("auto complete on search", value, tags);
          if (value.indexOf(" ") >= 0 || value.indexOf(";") >= 0) {
            const valueLast = value.split(/[ ]|;/).slice(-1);
            search(valueLast[0]);
          } else {
            search(value);
          }
        }}
        onSelect={(value: string, option: ValueType) => {
          if (typeof onSearch !== "undefined") {
            if (
              typeof input === "string" &&
              (input.indexOf(" ") >= 0 || input.indexOf(";") >= 0)
            ) {
              const last1 = input.lastIndexOf(" ");
              const last2 = input.lastIndexOf(";");
              let searchString = "";
              if (last1 > last2) {
                searchString = input.slice(0, last1 + 1) + value;
              } else {
                searchString = input.slice(0, last2 + 1) + value;
              }
              onSearch(searchString);
              setInput(searchString);
            } else {
              onSearch(value);
            }
          }
        }}
      >
        <Input.Search
          size={size}
          width={width}
          placeholder="input here"
          onSearch={(value: string) => {
            console.log("on search", value, tags);
            if (typeof onSearch !== "undefined") {
              onSearch(value);
            }
          }}
        />
      </AutoComplete>
    </>
  );
};

export default Widget;
