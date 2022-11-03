import { ProFormSelect } from "@ant-design/pro-components";
import { useIntl } from "react-intl";

const Widget = () => {
	const intl = useIntl();

	const langOptions = [
		{
			value: "English",
			label: "en-US",
		},
		{
			value: "zh-Hans",
			label: "简体中文 zh-Hans",
		},
		{
			value: "zh-Hant",
			label: "繁体中文 zh-Hant",
		},
	];
	return (
		<ProFormSelect
			options={langOptions}
			initialValue="zh-Hans"
			width="sm"
			name="lang"
			allowClear={false}
			label={intl.formatMessage({ id: "forms.fields.lang.label" })}
			rules={[
				{
					required: true,
					message: intl.formatMessage({
						id: "forms.message.lang.required",
					}),
				},
			]}
		/>
	);
};

export default Widget;
