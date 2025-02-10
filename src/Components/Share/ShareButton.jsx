import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import { shareHandler } from "../../utils";

function ShareButton({ shareUrl, shareTite, shareText, shareAlt } = {}) {
    return (
        <Button
            variant="outline-secondary"
            title={shareAlt || "Share this resource"}
            style={{
                color: "var(--bs-primary)",
            }}
            onClick={(e) => {
                e.preventDefault();
                shareHandler({ shareUrl, shareTite, shareText });
            }}
        >
            <i className="fas fa-share-alt" aria-hidden></i>
        </Button>
    );
}

ShareButton.defaultProps = {
    shareUrl: PropTypes.string,
    shareTite: PropTypes.string,
    shareText: PropTypes.string,
    shareAlt: PropTypes.string,
};

export default ShareButton;
