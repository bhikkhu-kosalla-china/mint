/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from "react";
import { Popover } from "antd";
import { ProCard } from "@ant-design/pro-components";
import ReactMarkdown from "react-markdown";

import { ApiGetText } from "../../utils";

interface IWidgetGrammarPop {
	text: string;
	gid: string;
}
const Widget = (prop: IWidgetGrammarPop) => {
	const [guide, setGuide] = useState("Loading");
	const grammarProfix = "guide-grammar-";
	const handleMouseMouseEnter = () => {
		console.log("mouseenter", prop.gid);
		//sessionStorage缓存
		const value = sessionStorage.getItem(grammarProfix + prop.gid);
		if (value === null) {
			fetchData(prop.gid);
		} else {
			const sGuide: string = value ? value : "";
			setGuide(sGuide);
		}
	};
	const userCard = (
		<>
			<ProCard style={{ maxWidth: 500, minWidth: 300, margin: 0 }}>
				<ReactMarkdown>{guide}</ReactMarkdown>
			</ProCard>
		</>
	);
	function fetchData(key: string) {
		const url = `/guide/zh-cn/${key}`;
		ApiGetText(url).then((response: String) => {
			const text = response as unknown as string;
			sessionStorage.setItem(grammarProfix + key, text);
			setGuide(text);
		});
	}
	return (
		<Popover content={userCard} placement="bottom">
			<a href="#" onMouseEnter={handleMouseMouseEnter}>
				{prop.text}
			</a>
		</Popover>
	);
};

export default Widget;
