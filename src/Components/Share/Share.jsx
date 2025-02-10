import PropTypes from "prop-types";
import { Row, Col } from "react-bootstrap";
import { shareHandler } from "../../utils";

function Share({ siteUrl, linkText, shareTitle, shareText } = {}) {
  const url = siteUrl || window.location.href;
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  return (
    <section id="share">
      <Row>
        <Col
          xs={{ span: 8, offset: 2 }}
          sm={{ span: 6, offset: 3 }}
          md={{ span: 4, offset: 4 }}
          lg={{ span: 2, offset: 5 }}
        >
          <a
            href="/"
            target="_self"
            rel="noopener noreferrer"
            className="qr-link"
            style={{ textAlign: "center" }}
            onClick={(e) => { 
              e.preventDefault();
              shareHandler({ shareUrl: url, shareTitle, shareText }) }}
          >
            <img
              style={{ maxWidth: "100%", marginBottom: "0.5rem" }}
              src="/assets/qr.svg"
              alt="QR code to this website"
            />
            <p>Click to {isMobile ? "Share" : "Copy"}</p>
            {/* <p>{text}</p> */}
          </a>
        </Col>
      </Row>
    </section>
  );
}

Share.propTypes = {
  siteUrl: PropTypes.string,
  linkText: PropTypes.string,
  shareTitle: PropTypes.string,
  shareText: PropTypes.string,
};

export default Share;
