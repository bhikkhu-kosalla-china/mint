import { useParams, Link } from "react-router-dom";
import { useIntl } from "react-intl";
import { useState } from "react";

import {
	Space,
	Layout,
	Breadcrumb,
	Button,
	Popover,
	Dropdown,
	MenuProps,
	Menu,
	Table,
} from "antd";
import { ProTable } from "@ant-design/pro-components";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";

import ArticleCreate from "../../../components/studio/article/ArticleCreate";
import { get } from "../../../request";
import { IArticleListResponse } from "../../../components/api/Article";
const onMenuClick: MenuProps["onClick"] = (e) => {
	console.log("click", e);
};

const menu = (
	<Menu
		onClick={onMenuClick}
		items={[
			{
				key: "1",
				label: "在藏经阁中打开",
				icon: <SearchOutlined />,
			},
			{
				key: "2",
				label: "分享",
				icon: <SearchOutlined />,
			},
			{
				key: "3",
				label: "删除",
				icon: <SearchOutlined />,
			},
		]}
	/>
);
interface DataItem {
	sn: number;
	id: string;
	title: string;
	subtitle: string;
	summary: string;
	publicity: number;
	createdAt: number;
}
const Widget = () => {
	const intl = useIntl(); //i18n
	const { studioname } = useParams(); //url 参数

	const articleCreate = <ArticleCreate studio={studioname} />;
	const linkRead = `/article/show/12345`;
	const linkStudio = `/studio/${studioname}`;

	return (
		<>
			<Breadcrumb>
				<Breadcrumb.Item>
					<Link to={linkStudio}>
						{intl.formatMessage({ id: "columns.studio.title" })}
					</Link>
				</Breadcrumb.Item>
				<Breadcrumb.Item>
					{intl.formatMessage({
						id: "columns.studio.collaboration.title",
					})}
				</Breadcrumb.Item>
				<Breadcrumb.Item>
					{intl.formatMessage({ id: "columns.studio.article.title" })}
				</Breadcrumb.Item>
			</Breadcrumb>
			<Layout>
				<ProTable<DataItem>
					columns={[
						{
							title: intl.formatMessage({
								id: "dict.fields.sn.label",
							}),
							dataIndex: "sn",
							key: "sn",
							width: 50,
							search: false,
						},
						{
							title: intl.formatMessage({
								id: "forms.fields.title.label",
							}),
							dataIndex: "title",
							key: "title",
							tip: "过长会自动收缩",
							ellipsis: true,
							render: (text, row, index, action) => {
								return (
									<Link
										to={`/studio/${studioname}/article/${row.id}/edit`}
									>
										{row.title}
									</Link>
								);
							},
						},
						{
							title: intl.formatMessage({
								id: "forms.fields.subtitle.label",
							}),
							dataIndex: "subtitle",
							key: "subtitle",
							tip: "过长会自动收缩",
							ellipsis: true,
						},
						{
							title: intl.formatMessage({
								id: "forms.fields.summary.label",
							}),
							dataIndex: "summary",
							key: "summary",
							tip: "过长会自动收缩",
							ellipsis: true,
						},

						{
							title: intl.formatMessage({
								id: "forms.fields.publicity.label",
							}),
							dataIndex: "publicity",
							key: "publicity",
							width: 100,
							search: false,
							filters: true,
							onFilter: true,
							valueEnum: {
								all: {
									text: intl.formatMessage({
										id: "tables.publicity.all",
									}),
									status: "Default",
								},
								0: {
									text: intl.formatMessage({
										id: "tables.publicity.disable",
									}),
									status: "Default",
								},
								10: {
									text: intl.formatMessage({
										id: "tables.publicity.private",
									}),
									status: "Processing",
								},
								20: {
									text: intl.formatMessage({
										id: "tables.publicity.public.bylink",
									}),
									status: "Processing",
								},
								30: {
									text: intl.formatMessage({
										id: "tables.publicity.public",
									}),
									status: "Success",
								},
								40: {
									text: intl.formatMessage({
										id: "tables.publicity.public.edit",
									}),
									status: "Success",
								},
							},
						},
						{
							title: intl.formatMessage({
								id: "forms.fields.created-at.label",
							}),
							key: "created-at",
							width: 100,
							search: false,
							dataIndex: "createdAt",
							valueType: "date",
							sorter: (a, b) => a.createdAt - b.createdAt,
						},
						{
							title: intl.formatMessage({ id: "buttons.option" }),
							key: "option",
							width: 120,
							valueType: "option",
							render: (text, row, index, action) => {
								return [
									<Dropdown.Button
										key={index}
										type="link"
										overlay={menu}
									>
										<Link
											to={`/studio/${studioname}/article/${row.id}/edit`}
										>
											{intl.formatMessage({
												id: "buttons.edit",
											})}
										</Link>
									</Dropdown.Button>,
								];
							},
						},
					]}
					rowSelection={{
						// 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
						// 注释该行则默认不显示下拉选项
						selections: [
							Table.SELECTION_ALL,
							Table.SELECTION_INVERT,
						],
					}}
					tableAlertRender={({
						selectedRowKeys,
						selectedRows,
						onCleanSelected,
					}) => (
						<Space size={24}>
							<span>
								{intl.formatMessage({ id: "buttons.selected" })}
								{selectedRowKeys.length}
								<Button
									type="link"
									style={{ marginInlineStart: 8 }}
									onClick={onCleanSelected}
								>
									{intl.formatMessage({
										id: "buttons.unselect",
									})}
								</Button>
							</span>
						</Space>
					)}
					tableAlertOptionRender={() => {
						return (
							<Space size={16}>
								<Button type="link">
									{intl.formatMessage({
										id: "buttons.delete.all",
									})}
								</Button>
							</Space>
						);
					}}
					request={async (params = {}, sorter, filter) => {
						// TODO
						console.log(params, sorter, filter);
						let url = `/v2/article?view=studio&name=${studioname}`;
						const offset =
							((params.current ? params.current : 1) - 1) *
							(params.pageSize ? params.pageSize : 20);
						url += `&limit=${params.pageSize}&offset=${offset}`;
						if (typeof params.keyword !== "undefined") {
							url +=
								"&search=" +
								(params.keyword ? params.keyword : "");
						}

						const res = await get<IArticleListResponse>(url);
						const items: DataItem[] = res.data.rows.map(
							(item, id) => {
								const date = new Date(item.created_at);
								return {
									sn: id + 1,
									id: item.uid,
									title: item.title,
									subtitle: item.subtitle,
									summary: item.summary,
									publicity: item.status,
									createdAt: date.getTime(),
								};
							}
						);
						return {
							total: res.data.count,
							succcess: true,
							data: items,
						};
					}}
					rowKey="id"
					bordered
					pagination={{
						showQuickJumper: true,
						showSizeChanger: true,
					}}
					search={false}
					options={{
						search: true,
					}}
					toolBarRender={() => [
						<Popover
							content={articleCreate}
							title="Create"
							placement="bottomRight"
						>
							<Button
								key="button"
								icon={<PlusOutlined />}
								type="primary"
							>
								{intl.formatMessage({ id: "buttons.create" })}
							</Button>
						</Popover>,
					]}
				/>
			</Layout>
		</>
	);
};

export default Widget;
