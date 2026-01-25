import { Col, Row, Button } from "react-bootstrap";
import Translate from "../Translate/Translate";
import PropTypes from "prop-types";
import { norCalResistNumber } from "../Rights/content";

function Header({ title, lead, disableTranslate } = {}) {
  return (
    <header>
      <Row>
        <Col style={{ textAlign: "center" }}>
          <Button
            href={
              `tel:${norCalResistNumber.replace(/[^0-9]/g, "")}`
            }
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            size="lg"
            className="report-ice-activity-btn"
          >
            { `📞 REPORT ICE ACTIVITY 📞 ${norCalResistNumber ? norCalResistNumber : ""} 📞` }
          </Button>
          <h1>{title || "Know Your Rights"}</h1>
          {lead && <p className="lead">{lead}</p>}
          {!disableTranslate && <Translate />}
        </Col>
      </Row>
    </header>
  );
}

Header.propTypes = {
  title: PropTypes.string,
  lead: PropTypes.string,
  disableTranslate: PropTypes.bool,
};

export default Header;
