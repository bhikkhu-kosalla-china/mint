import { Button, List, Select, Space } from "antd";
import { useEffect, useState } from "react";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

import { useAppSelector } from "../../../hooks";
import { getRelation } from "../../../reducers/relation";
import { getTerm } from "../../../reducers/term-vocabulary";
import { IWbw } from "./WbwWord";
import { useIntl } from "react-intl";
import store from "../../../store";
import { add, relationAddParam } from "../../../reducers/relation-add";

interface IOptions {
  value: string;
  label: JSX.Element;
}

export interface IRelation {
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
}
const WbwDetailRelationWidget = ({ data, onChange, onAdd }: IWidget) => {
  const getSourId = () => `${data.book}-${data.para}-` + data.sn.join("-");

  const intl = useIntl();
  const [relation, setRelation] = useState<IRelation[]>([]);
  const [newRelationName, setNewRelationName] = useState<string>();
  const newRelationRow: IRelation = {
    sour_id: getSourId(),
    sour_spell: data.word.value,
    dest_id: "",
    dest_spell: "",
    relation: undefined,
    is_new: true,
  };
  const [options, setOptions] = useState<IOptions[]>();
  const terms = useAppSelector(getTerm);
  const relations = useAppSelector(getRelation);

  const addParam = useAppSelector(relationAddParam);
  useEffect(() => {
    if (
      addParam?.command === "apply" &&
      addParam.src_sn === data.sn.join("-") &&
      addParam.target_spell
    ) {
      const newRelation: IRelation = {
        sour_id: getSourId(),
        sour_spell: data.word.value,
        dest_id: addParam.target_id ? addParam.target_id : "",
        dest_spell: addParam.target_spell,
        relation: newRelationName,
      };
      setRelation([...relation, newRelation]);
      setNewRelationName(undefined);
    }
  }, [addParam?.command]);

  useEffect(() => {
    if (typeof data.relation === "undefined") {
      return;
    }
    const arrRelation: IRelation[] = JSON.parse(
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
        grammar = [data.grammar2?.value, ...grammar];
      } else {
        grammar = [data.grammar2?.value];
      }
    }
    console.log("grammar", grammar);
    if (typeof grammar === "undefined") {
      return;
    }
    const mRelation = relations
      ?.filter((value) => {
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
      })
      .map((item) => {
        const localName = terms?.find(
          (term) => term.word === item.name
        )?.meaning;
        return {
          value: item.name,
          label: (
            <Space>
              {item.name}
              {localName}
            </Space>
          ),
        };
      });
    setOptions(mRelation);
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
          })
        );
      }}
    >
      {intl.formatMessage({ id: "buttons.add" })}
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
                  let arrRelation: IRelation[] = [...relation];
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
            {item.dest_spell ? item.dest_spell : addButton}
            <Select
              defaultValue={item.relation}
              style={{ width: 180 }}
              onChange={(value: string) => {
                if (item.is_new) {
                  setNewRelationName(value);
                  return;
                }
                console.log(`selected ${value}`);
                let arrRelation: IRelation[] = [...relation];
                arrRelation[index].relation = value;
                setRelation(arrRelation);
                if (typeof onChange !== "undefined") {
                  onChange({
                    field: "relation",
                    value: JSON.stringify(arrRelation),
                  });
                }
              }}
              options={options}
            />
          </Space>
        </List.Item>
      )}
    />
  );
};

export default WbwDetailRelationWidget;
