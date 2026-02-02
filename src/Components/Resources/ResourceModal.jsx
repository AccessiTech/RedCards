import { Modal, Button } from "react-bootstrap";
import { titleCase } from "../../utils";
import { useNavigate } from "react-router";
import ShareButton from "../Share/ShareButton";

function ResourceModal({ showModal, modalContent }) {
  const navigate = useNavigate();
  return (
    <Modal show={showModal} onHide={() => navigate('/')}>
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title>
          {modalContent?.title}
          <ShareButton {...{
            shareUrl: window.location.href,
            shareTitle: modalContent?.title,
            shareText: modalContent?.description,
            shareAlt: "Share this resource",
          }} />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{modalContent?.description}</p>
        {modalContent?.links?.map((link, i) => (
          <div key={link.title + '-' + i} className="modal-item">
            {link.description ? <h3>{link.title}</h3> : null}
            <p>
              {link.descriptionLink ? (
                <a
                  href={link.descriptionLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.description}
                </a>
              ) : link.description}
            </p>

            <Button
              as="a"
              variant="primary-outline"
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="modal-link"
            >
              {titleCase((link.btnText || link.title).replace(/_/g, " "))}
            </Button>
          </div>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <a
          href={modalContent?.source}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textAlign: "center", display: "block", width: "100%" }}
        >
          {modalContent?.sourceName}
        </a>
      </Modal.Footer>
    </Modal>
  );
}

export default ResourceModal;
