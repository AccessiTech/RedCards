import { useState } from "react";
import PropTypes from "prop-types";
import { Row, Col } from "react-bootstrap";
import { shareHandler } from "../../utils";

function Share({ siteUrl, linkText, shareTitle, shareText } = {}) {
  const url = siteUrl || window.location.href;
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const [shareStatus, setShareStatus] = useState({ type: null, message: "" });
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async (e) => {
    e.preventDefault();
    setIsSharing(true);
    setShareStatus({ type: "loading", message: "" });

    await shareHandler({
      shareUrl: url,
      shareTitle,
      shareText,
      onSuccess: (message) => {
        setShareStatus({ type: "success", message });
        setIsSharing(false);
        // Clear success message after 3 seconds
        setTimeout(() => setShareStatus({ type: null, message: "" }), 3000);
      },
      onError: (message) => {
        setShareStatus({ type: "error", message });
        setIsSharing(false);
        // Clear error message after 5 seconds
        setTimeout(() => setShareStatus({ type: null, message: "" }), 5000);
      },
    });
  };

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
            id="qr-link"
            style={{ textAlign: "center" }}
            onClick={handleShare}
            aria-disabled={isSharing}
          >
            <img
              style={{ maxWidth: "100%", marginBottom: "0.5rem" }}
              src="/assets/qr.svg"
              alt="QR code to this website"
            />
            <p>
              {isSharing ? "Sharing..." : `Click to ${isMobile ? "Share" : "Copy"}`}
            </p>
            {linkText && <p>{linkText}</p>}
            {shareStatus.message && (
              <p 
                className={`share-status ${shareStatus.type}`}
                role={shareStatus.type === "error" ? "alert" : "status"}
                aria-live="polite"
                style={{
                  marginTop: "0.5rem",
                  padding: "0.5rem",
                  borderRadius: "0.25rem",
                  backgroundColor: shareStatus.type === "error" ? "#f8d7da" : "#d1e7dd",
                  color: shareStatus.type === "error" ? "#842029" : "#000000",
                  fontSize: "0.875rem",
                }}
              >
                {shareStatus.message}
              </p>
            )}
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
