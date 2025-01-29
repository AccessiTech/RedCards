import { useState } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import ResourceBtn from "./ResourceBtn";
import { titleCase } from "../../utils";
import {
  digitalResources,
  printableResources,
} from "./content";
import PropTypes from "prop-types";
import ResourceModal from "./ResourceModal";


function Resources({ hideDigitals, hidePrintables }) {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  return (
    <section id="resources">
      {!hideDigitals && (
      <Row>
        <Col>
          <h2 id="digital-resources">Digital Resources</h2>
          <Row
            style={{
              marginBottom: "3rem",
              justifyContent: "center",
            }}
          >
            {/* buttons for digital resources */}
            {Object.entries(digitalResources).map(([source, data]) => (
              <Col key={source} sm={12} md={6}>
                <ResourceBtn
                  data={data}
                  source={source}
                  setShowModal={setShowModal}
                  setModalContent={setModalContent}
                />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
      )}
      {!hidePrintables && (
      <Row>
        <Col>
          <h2 id="printable-resources">Printable Resources</h2>
          {/* buttons for redcards, the flyer, and the qr code svg */}
          <Row>
            {Object.entries(printableResources).map(([source, data]) => (
              <Col key={source} sm={12} md={4}>
                <ResourceBtn
                  data={data}
                  source={source}
                  setShowModal={setShowModal}
                  setModalContent={setModalContent}
                />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
      )}
      <ResourceModal
        showModal={showModal}
        setShowModal={setShowModal}
        modalContent={modalContent}
      />
    </section>
  );
}

Resources.prototype = {
  hideDigitals: PropTypes.bool,
  hidePrintables: PropTypes.bool,
};

export default Resources;
