import { useIntl } from "react-intl";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Card } from "antd";
import { Col, Row } from "antd";

import { get } from "../../../request";
import { IGroupResponse } from "../../../components/api/Group";
import GroupFile from "../../../components/group/GroupFile";
import GroupMember from "../../../components/group/GroupMember";
import GoBack from "../../../components/studio/GoBack";

const Widget = () => {
  const intl = useIntl();
  const { studioname, groupid } = useParams(); //url 参数
  const [title, setTitle] = useState("loading");
  useEffect(() => {
    get<IGroupResponse>(`/v2/group/${groupid}`).then((json) => {
      setTitle(json.data.name);
    });
  }, [groupid]);
  return (
    <Card
      title={<GoBack to={`/studio/${studioname}/group/list`} title={title} />}
      extra={
        <Button type="link" danger>
          {intl.formatMessage({ id: "buttons.group.exit" })}
        </Button>
      }
    >
      <Row>
        <Col flex="auto">
          <GroupFile groupId={groupid} />
        </Col>
        <Col flex="400px">
          <GroupMember groupId={groupid} />
        </Col>
      </Row>
    </Card>
  );
};

export default Widget;
