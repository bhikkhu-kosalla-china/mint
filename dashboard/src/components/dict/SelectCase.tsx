import { Cascader } from "antd";
import { useIntl } from "react-intl";

interface CascaderOption {
  value: string | number;
  label: string;
  children?: CascaderOption[];
}
interface IWidget {
  defaultValue?: string[];
  onCaseChange?: Function;
}
const Widget = ({ defaultValue, onCaseChange }: IWidget) => {
  const intl = useIntl();

  const case8 = [
    {
      value: "nom",
      label: intl.formatMessage({ id: "dict.fields.type.nom.label" }),
    },
    {
      value: "acc",
      label: intl.formatMessage({ id: "dict.fields.type.acc.label" }),
    },
    {
      value: "gen",
      label: intl.formatMessage({ id: "dict.fields.type.gen.label" }),
    },
    {
      value: "dat",
      label: intl.formatMessage({ id: "dict.fields.type.dat.label" }),
    },
    {
      value: "inst",
      label: intl.formatMessage({ id: "dict.fields.type.inst.label" }),
    },
    {
      value: "abl",
      label: intl.formatMessage({ id: "dict.fields.type.abl.label" }),
    },
    {
      value: "voc",
      label: intl.formatMessage({ id: "dict.fields.type.voc.label" }),
    },
  ];
  const case2 = [
    {
      value: "sg",
      label: intl.formatMessage({ id: "dict.fields.type.sg.label" }),
      children: case8,
    },
    {
      value: "pl",
      label: intl.formatMessage({ id: "dict.fields.type.pl.label" }),
      children: case8,
    },
    {
      value: "base",
      label: intl.formatMessage({ id: "dict.fields.type.base.label" }),
    },
  ];
  const case3 = [
    {
      value: "m",
      label: intl.formatMessage({ id: "dict.fields.type.m.label" }),
      children: case2,
    },
    {
      value: "nt",
      label: intl.formatMessage({ id: "dict.fields.type.nt.label" }),
      children: case2,
    },
    {
      value: "f",
      label: intl.formatMessage({ id: "dict.fields.type.f.label" }),
      children: case2,
    },
  ];
  const caseVerb3 = [
    {
      value: "pres",
      label: intl.formatMessage({ id: "dict.fields.type.pres.label" }),
    },
    {
      value: "aor",
      label: intl.formatMessage({ id: "dict.fields.type.aor.label" }),
    },
    {
      value: "fut",
      label: intl.formatMessage({ id: "dict.fields.type.fut.label" }),
    },
    {
      value: "pf",
      label: intl.formatMessage({ id: "dict.fields.type.pf.label" }),
    },
    {
      value: "imp",
      label: intl.formatMessage({ id: "dict.fields.type.imp.label" }),
    },
    {
      value: "cond",
      label: intl.formatMessage({ id: "dict.fields.type.cond.label" }),
    },
    {
      value: "opt",
      label: intl.formatMessage({ id: "dict.fields.type.opt.label" }),
    },
  ];
  const caseVerb2 = [
    {
      value: "sg",
      label: intl.formatMessage({ id: "dict.fields.type.sg.label" }),
      children: caseVerb3,
    },
    {
      value: "pl",
      label: intl.formatMessage({ id: "dict.fields.type.pl.label" }),
      children: caseVerb3,
    },
  ];
  const caseVerbInd = [
    {
      value: "abs",
      label: intl.formatMessage({ id: "dict.fields.type.abs.label" }),
    },
    {
      value: "ger",
      label: intl.formatMessage({ id: "dict.fields.type.ger.label" }),
    },
    {
      value: "inf",
      label: intl.formatMessage({ id: "dict.fields.type.inf.label" }),
    },
  ];
  const caseInd = [
    {
      value: "ind",
      label: intl.formatMessage({ id: "dict.fields.type.ind.label" }),
    },
    {
      value: "adv",
      label: intl.formatMessage({ id: "dict.fields.type.adv.label" }),
    },
    {
      value: "conj",
      label: intl.formatMessage({ id: "dict.fields.type.conj.label" }),
    },
    {
      value: "prep",
      label: intl.formatMessage({ id: "dict.fields.type.prep.label" }),
    },
    {
      value: "interj",
      label: intl.formatMessage({ id: "dict.fields.type.interj.label" }),
    },
    {
      value: "pre",
      label: intl.formatMessage({ id: "dict.fields.type.pre.label" }),
    },
    {
      value: "suf",
      label: intl.formatMessage({ id: "dict.fields.type.suf.label" }),
    },
    {
      value: "end",
      label: intl.formatMessage({ id: "dict.fields.type.end.label" }),
    },
    {
      value: "part",
      label: intl.formatMessage({ id: "dict.fields.type.part.label" }),
    },
  ];
  const caseVerb1 = [
    {
      value: "1p",
      label: intl.formatMessage({ id: "dict.fields.type.1p.label" }),
      children: caseVerb2,
    },
    {
      value: "2p",
      label: intl.formatMessage({ id: "dict.fields.type.2p.label" }),
      children: caseVerb2,
    },
    {
      value: "3p",
      label: intl.formatMessage({ id: "dict.fields.type.3p.label" }),
      children: caseVerb2,
    },
    {
      value: "ind",
      label: intl.formatMessage({ id: "dict.fields.type.ind.label" }),
      children: caseVerbInd,
    },
    {
      value: "base",
      label: intl.formatMessage({ id: "dict.fields.type.base.label" }),
    },
  ];
  const options: CascaderOption[] = [
    {
      value: "n",
      label: intl.formatMessage({ id: "dict.fields.type.n.label" }),
      children: case3,
    },
    {
      value: "ti",
      label: intl.formatMessage({ id: "dict.fields.type.ti.label" }),
      children: case3,
    },
    {
      value: "v",
      label: intl.formatMessage({ id: "dict.fields.type.v.label" }),
      children: caseVerb1,
    },
    {
      value: "ind",
      label: intl.formatMessage({ id: "dict.fields.type.ind.label" }),
      children: caseInd,
    },
    {
      value: "un",
      label: intl.formatMessage({ id: "dict.fields.type.un.label" }),
    },
    {
      value: "adj",
      label: intl.formatMessage({ id: "dict.fields.type.adj.label" }),
      children: case3,
    },
  ];
  const onChange = (value: (string | number)[]) => {
    console.log("case changed", value);
    if (typeof onCaseChange !== "undefined") {
      onCaseChange(value);
    }
  };

  return (
    <Cascader
      options={options}
      defaultValue={defaultValue}
      placeholder="Please select case"
      onChange={onChange}
    />
  );
};

export default Widget;