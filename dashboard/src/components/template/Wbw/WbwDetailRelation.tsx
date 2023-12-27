import { Button, List, Select, Space } from "antd";
import { useEffect, useState } from "react";
import {
  DeleteOutlined,
  PlusOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

import { useAppSelector } from "../../../hooks";
import { getRelation } from "../../../reducers/relation";
import { getTerm } from "../../../reducers/term-vocabulary";
import { IWbw } from "./WbwWord";
import { useIntl } from "react-intl";
import store from "../../../store";
import { add, relationAddParam } from "../../../reducers/relation-add";
import { IRelation } from "../../../pages/admin/relation/list";

interface IOptions {
  value: string;
  label: JSX.Element;
}

export interface IWbwRelation {
  sour_id: string;
  sour_spell: string;
  dest_id: string;
  dest_spell: string;
  relation?: string;
  is_new?: Boolean;
}
interface IWidget {
  data: IWbw;
  onChange?: Function;
  onAdd?: Function;
  onFromList?: Function;
}
const WbwDetailRelationWidget = ({
  data,
  onChange,
  onAdd,
  onFromList,
}: IWidget) => {
  const getSourId = () => `${data.book}-${data.para}-` + data.sn.join("-");

  const intl = useIntl();
  const [relation, setRelation] = useState<IWbwRelation[]>([]);
  const [currRelation, setCurrRelation] = useState<IRelation[]>();
  const [relationOptions, setRelationOptions] = useState<IRelation[]>();
  const [newRelationName, setNewRelationName] = useState<string>();
  const [fromList, setFromList] = useState<string[]>();

  const [options, setOptions] = useState<IOptions[]>();
  const terms = useAppSelector(getTerm);
  const relations = useAppSelector(getRelation);

  const addParam = useAppSelector(relationAddParam);

  const newRelationRow: IWbwRelation = {
    sour_id: getSourId(),
    sour_spell: data.word.value,
    dest_id: "",
    dest_spell: "",
    relation: undefined,
    is_new: true,
  };

  useEffect(() => {
    if (typeof onFromList !== "undefined") {
      onFromList(fromList);
    }
  }, [fromList]);
  useEffect(() => {
    if (
      addParam?.command === "apply" &&
      addParam.src_sn === data.sn.join("-") &&
      addParam.target_spell
    ) {
      const newRelation: IWbwRelation = {
        sour_id: getSourId(),
        sour_spell: data.word.value,
        dest_id: addParam.target_id ? addParam.target_id : "",
        dest_spell: addParam.target_spell,
        relation: newRelationName,
      };
      setRelation((origin) => {
        origin.push(newRelation);
        if (typeof onChange !== "undefined") {
          onChange({
            field: "relation",
            value: JSON.stringify(origin),
          });
        }
        return origin;
      });
      setNewRelationName(undefined);
    }
  }, [addParam?.command]);

  useEffect(() => {
    if (typeof data.relation === "undefined") {
      return;
    }
    const arrRelation: IWbwRelation[] = JSON.parse(
      data.relation?.value ? data.relation?.value : "[]"
    );
    setRelation(arrRelation);
  }, [data.relation]);

  useEffect(() => {
    let grammar = data.case?.value
      ?.replace("#", "$")
      .replaceAll(".", "")
      .split("$");
    if (data.grammar2?.value) {
      if (grammar) {
        grammar = [data.grammar2?.value.replaceAll(".", ""), ...grammar];
      } else {
        grammar = [data.grammar2?.value.replaceAll(".", "")];
      }
    }
    console.log("relation match grammar", grammar);
    if (typeof grammar === "undefined") {
      return;
    }

    //找出符合条件的relation

    const filteredRelation = relations?.filter((value) => {
      let caseMatch = true;
      let spellMatch = true;
      if (!value.from) {
        return false;
      }
      if (value.from?.case) {
        let matchCount = 0;
        if (grammar) {
          for (const iterator of value.from.case) {
            if (grammar?.includes(iterator)) {
              matchCount++;
            }
          }
        }
        if (matchCount !== value.from.case.length) {
          caseMatch = false;
        }
      }
      if (value.from?.spell) {
        if (data.real.value !== value.from?.spell) {
          spellMatch = false;
        }
      }
      return caseMatch && spellMatch;
    });
    setCurrRelation(filteredRelation);
    setRelationOptions(filteredRelation);
    let relationName = new Map<string, string>();
    let relationFrom: string[] = [];
    filteredRelation?.forEach((value) => {
      relationName.set(value.name, value.name);
      let from: string[] = [];
      if (value.from?.spell) {
        from.push(value.from.spell);
      }
      if (value.from?.case) {
        from = [...from, ...value.from.case];
      }
      if (!relationFrom.includes(from.join("."))) {
        relationFrom.push(from.join("."));
      }
    });

    const mRelation = Array.from(relationName.keys()).map((item) => {
      const localName = terms?.find((term) => term.word === item)?.meaning;
      return {
        value: item,
        label: (
          <Space>
            {item}
            {localName}
          </Space>
        ),
      };
    });
    setOptions(mRelation);

    if (typeof onFromList !== "undefined") {
      console.debug("relationFrom", relationFrom);
      onFromList(relationFrom);
    }
  }, [
    data.case?.value,
    data.grammar2?.value,
    data.real.value,
    relations,
    terms,
  ]);
  const addButton = (
    <Button
      type="dashed"
      icon={<PlusOutlined />}
      onClick={() => {
        if (typeof onAdd !== "undefined") {
          onAdd();
        }
        store.dispatch(
          add({
            book: data.book,
            para: data.para,
            src_sn: data.sn.join("-"),
            command: "add",
            relations: currRelation,
          })
        );
      }}
    >
      {intl.formatMessage({ id: "buttons.relate.to" })}
    </Button>
  );
  return (
    <List
      itemLayout="vertical"
      size="small"
      dataSource={[...relation, newRelationRow]}
      renderItem={(item, index) => (
        <List.Item>
          <Space>
            {item.is_new ? undefined : (
              <Button
                type="text"
                icon={<DeleteOutlined />}
                onClick={() => {
                  let arrRelation: IWbwRelation[] = [...relation];
                  arrRelation.splice(index, 1);
                  setRelation(arrRelation);
                  if (typeof onChange !== "undefined") {
                    onChange({
                      field: "relation",
                      value: JSON.stringify(arrRelation),
                    });
                  }
                }}
              />
            )}

            <Select
              defaultValue={item.relation}
              placeholder={"请选择关系"}
              allowClear={item.is_new ? true : false}
              style={{ width: 180 }}
              onChange={(value: string) => {
                if (item.is_new) {
                  setNewRelationName(value);
                  return;
                }
                const currSelect = relationOptions?.filter(
                  (rl) => rl.name === value
                );
                setCurrRelation(currSelect);
                console.log(`selected ${value}`);
                setRelation((origin) => {
                  origin[index].relation = value;
                  if (typeof onChange !== "undefined") {
                    onChange({
                      field: "relation",
                      value: JSON.stringify(origin),
                    });
                  }
                  return origin;
                });
              }}
              options={options}
            />
            <Button type="link" icon={<InfoCircleOutlined />} />
            {item.dest_spell ? item.dest_spell : addButton}
          </Space>
        </List.Item>
      )}
    />
  );
};

export default WbwDetailRelationWidget;
