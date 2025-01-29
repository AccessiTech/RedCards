import { Modal, Button } from "react-bootstrap";
import { titleCase } from "../../utils";

function ResourceModal({ showModal, setShowModal, modalContent }) {
  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title>{modalContent?.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{modalContent?.description}</p>
        {modalContent?.links?.map((link) => (
          <div key={link.title} className="modal-item">
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
