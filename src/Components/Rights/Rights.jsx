import { Button, Col, Nav, Row, Tab } from "react-bootstrap";
import { attribution, ctaUrl, ctaTitle, leftHeader, rightHeader, leftColContent, rightColContent } from "./content";
import PropTypes from "prop-types";

function Rights(props) {
  
  return (
    <section id="rights">
      <Row>
        <Col md={6}>
          <h2>{props.leftHeader || leftHeader}</h2>
          {leftColContent}
        </Col>
        <Col md={6}>
          <Tab.Container defaultActiveKey="translated" id="language-tabs">
            <Row>
              <Col>
                <h2>{props.rightHeader || rightHeader}</h2>
              </Col>
              <Col style={{ width: "100%" }}>
                <Nav variant="pills" className="justify-content-end">
                  <Nav.Item>
                    <Nav.Link eventKey="translated">Translated</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="english">English</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
            </Row>
            <Row>
              <Col>
                <Tab.Content>
                  <Tab.Pane eventKey="translated" title="Translated">
                    {rightColContent}
                  </Tab.Pane>
                  <Tab.Pane
                    eventKey="english"
                    title="English"
                    className="skiptranslate"
                  >
                    {rightColContent}
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Col>
      </Row>
      <Row>
        <Col>{attribution}</Col>
      </Row>
      <Row>
        <Col>
          <Button
            href={
              props.ctaUrl || ctaUrl
            }
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            size="lg"
            className="external-link"
          >
            {props.ctaTitle || ctaTitle}
          </Button>
        </Col>
      </Row>
    </section>
  );
}

Rights.prototype = {
  ctaUrl: PropTypes.string,
  ctaTitle: PropTypes.string,
  leftHeader: PropTypes.string,
  rightHeader: PropTypes.string,
};

export default Rights;
