import { useState } from "react";
import { useIntl } from "react-intl";
import { Button, Card } from "antd";
import { Input, message } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import {
  ProForm,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { Col, Row, Space } from "antd";

import { IComment } from "./CommentItem";
import { post, put } from "../../request";
import { ICommentRequest, ICommentResponse } from "../api/Comment";

const { TextArea } = Input;

interface IWidget {
  data: IComment;
  onCreated?: Function;
}
const Widget = ({ data, onCreated }: IWidget) => {
  const intl = useIntl();
  const [value, setValue] = useState(data.content);

  const [saving, setSaving] = useState<boolean>(false);

  const save = () => {
    setSaving(true);
    put<ICommentRequest, ICommentResponse>(`/v2/discussion/${data.id}`, {
      content: value,
    })
      .then((json) => {
        console.log(json);
        setSaving(false);

        if (json.ok) {
          console.log(intl.formatMessage({ id: "flashes.success" }));
        } else {
          message.error(json.message);
        }
      })
      .catch((e) => {
        setSaving(false);
        console.error("catch", e);
        message.error(e.message);
      });
  };
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };
  return (
    <div>
      <ProForm<IComment>
        {...formItemLayout}
        layout="horizontal"
        submitter={{
          render: (props, doms) => {
            return (
              <Row>
                <Col span={14} offset={4}>
                  <Space>{doms}</Space>
                </Col>
              </Row>
            );
          },
        }}
        onFinish={async (values) => {
          if (typeof values.id === "undefined") {
            //新建
            post<ICommentRequest, ICommentResponse>(`/v2/discussion`, {
              res_id: data.resId,
              res_type: data.resType,
              title: values.title,
              content: values.content,
            })
              .then((json) => {
                console.log(json);
                if (json.ok) {
                  console.log(intl.formatMessage({ id: "flashes.success" }));
                  if (typeof onCreated !== "undefined") {
                    onCreated(json.data);
                  }
                } else {
                  message.error(json.message);
                }
              })
              .catch((e) => {
                message.error(e.message);
              });
          } else {
            //修改
          }
        }}
        params={{}}
        request={async () => {
          return data;
        }}
      >
        <ProFormText
          name="title"
          label={intl.formatMessage({ id: "forms.fields.title.label" })}
          tooltip="最长为 24 位"
          placeholder={intl.formatMessage({
            id: "forms.message.title.required",
          })}
        />
        <ProFormTextArea
          name="content"
          label={intl.formatMessage({ id: "forms.fields.content.label" })}
          placeholder={intl.formatMessage({
            id: "forms.fields.content.placeholder",
          })}
        />
      </ProForm>
      <Card
        title={<span>{data.user.nickName}</span>}
        extra={
          <Button shape="circle" size="small">
            xxx
          </Button>
        }
        style={{ width: "auto" }}
      >
        <TextArea
          rows={4}
          showCount
          maxLength={2048}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <div>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={saving}
            onClick={() => save()}
          >
            Save
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Widget;
