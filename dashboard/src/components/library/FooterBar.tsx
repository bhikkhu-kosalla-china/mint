import { Link } from "react-router-dom";
import { Layout, Row, Col, Typography } from "antd";
import BeiAn from "../general/BeiAn";

const { Footer } = Layout;
const { Paragraph } = Typography;

const FooterBarWidget = () => {
  //Library foot bar
  // TODO 补充项目信息
  return (
    <Footer>
      <Row>
        <Col span={8}>
          <Paragraph strong>相关链接</Paragraph>
          <ul>
            <li>
              <Link to="www.github.com/iapt-platform/mint" target="_blank">
                wikipali in github
              </Link>
            </li>
            <li>nissaya project</li>
          </ul>
        </Col>
        <Col span={16}>
          <Paragraph strong>问题反馈</Paragraph>
        </Col>
      </Row>
      <Row>
        <Col>
          <BeiAn />
        </Col>
      </Row>
    </Footer>
  );
};

export default FooterBarWidget;
