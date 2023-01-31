import Exercise from "./Exercise";
import Note from "./Note";
import Quote from "./Quote";
import SentEdit from "./SentEdit";
import SentRead from "./SentRead";
import Term from "./Term";
import WbwSent from "./WbwSent";
import Wd from "./Wd";

interface IWidgetMdTpl {
  tpl?: string;
  props?: string;
  children?: React.ReactNode;
}
const Widget = ({ tpl, props, children }: IWidgetMdTpl) => {
  switch (tpl) {
    case "term":
      return <Term props={props ? props : ""} />;
    case "note":
      return <Note props={props ? props : ""}>{children}</Note>;
    case "sentread":
      return <SentRead props={props ? props : ""} />;
    case "sentedit":
      return <SentEdit props={props ? props : ""} />;
    case "wbw_sent":
      return <WbwSent props={props ? props : ""} />;
    case "wd":
      return <Wd props={props ? props : ""} />;
    case "quote":
      return <Quote props={props ? props : ""} />;
    case "exercise":
      return <Exercise props={props ? props : ""}>{children}</Exercise>;
    default:
      return <>未定义模版({tpl})</>;
  }
};

export default Widget;
