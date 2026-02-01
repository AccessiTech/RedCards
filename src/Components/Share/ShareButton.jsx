import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import { shareHandler } from "../../utils";

function ShareButton({ shareUrl, shareTitle, shareText, shareAlt } = {}) {
    return (
        <Button
            variant="outline-secondary"
            title={shareAlt || "Share this resource"}
            style={{
                color: "var(--bs-primary)",
            }}
            onClick={(e) => {
                e.preventDefault();
                shareHandler({ shareUrl, shareTitle, shareText });
            }}
        >
            <i className="fas fa-share-alt" aria-hidden></i>
        </Button>
    );
}

ShareButton.propTypes = {
    shareUrl: PropTypes.string,
    shareTitle: PropTypes.string,
    shareText: PropTypes.string,
    shareAlt: PropTypes.string,
};

export default ShareButton;
