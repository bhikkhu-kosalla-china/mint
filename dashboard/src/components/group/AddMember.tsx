import { useIntl } from "react-intl";
import { ProForm, ProFormSelect } from "@ant-design/pro-components";
import { Button, message, Popover } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import { get, post } from "../../request";
import { IUserListResponse } from "../api/Auth";
import { IGroupMemberData, IGroupMemberResponse } from "../api/Group";
import { useState } from "react";

interface IFormData {
  userId: string;
}

interface IWidget {
  groupId?: string;
  onCreated?: Function;
}
const Widget = ({ groupId, onCreated }: IWidget) => {
  const intl = useIntl();
  const [open, setOpen] = useState(false);

  const form = (
    <ProForm<IFormData>
      onFinish={async (values: IFormData) => {
        // TODO
        console.log(values);
        if (typeof groupId !== "undefined") {
          post<IGroupMemberData, IGroupMemberResponse>("/v2/group-member", {
            user_id: values.userId,
            group_id: groupId,
          }).then((json) => {
            console.log("add member", json);
            if (json.ok) {
              message.success(intl.formatMessage({ id: "flashes.success" }));
              setOpen(false);
              if (typeof onCreated !== "undefined") {
                onCreated();
              }
            }
          });
        }
      }}
    >
      <ProForm.Group>
        <ProFormSelect
          name="userId"
          label={intl.formatMessage({ id: "forms.fields.user.label" })}
          showSearch
          debounceTime={300}
          request={async ({ keyWords }) => {
            console.log("keyWord", keyWords);
            const json = await get<IUserListResponse>(
              `/v2/user?view=key&key=${keyWords}`
            );
            const userList = json.data.rows.map((item) => {
              return {
                value: item.id,
                label: `${item.userName}-${item.nickName}`,
              };
            });
            console.log("json", userList);
            return userList;
          }}
          placeholder={intl.formatMessage({
            id: "forms.message.user.required",
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: "forms.message.user.required",
              }),
            },
          ]}
        />
      </ProForm.Group>
    </ProForm>
  );
  const handleClickChange = (open: boolean) => {
    setOpen(open);
  };
  return (
    <Popover
      placement="bottom"
      arrowPointAtCenter
      content={form}
      trigger="click"
      open={open}
      onOpenChange={handleClickChange}
    >
      <Button icon={<UserAddOutlined />} key="add" type="primary">
        {intl.formatMessage({ id: "buttons.group.add.member" })}
      </Button>
    </Popover>
  );
};

export default Widget;