import ReactMarkdown from "react-markdown";
import code_png from "../../assets/nut/code.png";
import ChannelPicker from "../channel/ChannelPicker";
import MdView from "../template/MdView";

import MarkdownForm from "./MarkdownForm";
import MarkdownShow from "./MarkdownShow";
import FontBox from "./FontBox";
import DemoForm from "./Form";
import WbwTest from "./WbwTest";

const Widget = () => {
  return (
    <div>
      <h1>Home</h1>
      <h2>wbw</h2>
      <WbwTest />
      <h2>channel picker</h2>
      <div style={{ width: 1000 }}>
        <ChannelPicker type="chapter" articleId="168-915" />
      </div>
      <h2>MdView test</h2>
      <MdView html="<h1 name='h1'>hello<MdTpl name='term'/></h1>" />

      <br />
      <DemoForm />
      <br />
      <FontBox />
      <br />

      <MarkdownShow body="- Hello, **《mint》**!" />
      <br />
      <h3>Form</h3>
      <MarkdownForm />
      <br />
      <img alt="code" src={code_png} />
      <div>
        <ReactMarkdown>*This* is text with `quote`</ReactMarkdown>
      </div>
    </div>
  );
};

export default Widget;
