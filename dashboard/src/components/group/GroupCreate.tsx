import { useIntl } from "react-intl";
import { ProForm, ProFormText } from "@ant-design/pro-components";
import { message } from "antd";
import { post } from "../../request";
import { IGroupRequest, IGroupResponse } from "../api/Group";

interface IFormData {
  name: string;
}

interface IWidgetGroupCreate {
  studio?: string;
  onCreate?: Function;
}
const Widget = ({ studio, onCreate }: IWidgetGroupCreate) => {
  const intl = useIntl();

  return (
    <ProForm<IFormData>
      onFinish={async (values: IFormData) => {
        // TODO
        if (typeof studio === "undefined") {
          return;
        }
        console.log(values);
        const res = await post<IGroupRequest, IGroupResponse>(`/v2/group`, {
          name: values.name,
          studio_name: studio,
        });
        console.log(res);
        if (res.ok) {
          message.success(intl.formatMessage({ id: "flashes.success" }));
          if (typeof onCreate !== "undefined") {
            onCreate();
          }
        } else {
          message.error(res.message);
        }
      }}
    >
      <ProForm.Group>
        <ProFormText
          width="md"
          name="name"
          required
          label={intl.formatMessage({ id: "channel.name" })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: "channel.create.message.noname",
              }),
            },
          ]}
        />
      </ProForm.Group>
    </ProForm>
  );
};

export default Widget;
