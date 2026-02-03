import { useEffect, useState } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import ResourceBtn from "./ResourceBtn";
import { titleCase } from "../../utils";
import { getDigitalResources, getPrintableResources } from "../../config";
import PropTypes from "prop-types";
import ResourceModal from "./ResourceModal";
import { useParams } from "react-router";

// Get resources from config
const digitalResources = getDigitalResources();
const printableResources = getPrintableResources();


function Resources({ hideDigitals, hidePrintables }) {
  const { id } = useParams();
  const [modalContent, setModalContent] = useState(
    (id && (digitalResources[id] || printableResources[id])) || null
  );
  const [showModal, setShowModal] = useState(id && modalContent ? true : false);

  useEffect(() => {
    if (id && (digitalResources[id] || printableResources[id])) {
      setModalContent(digitalResources[id] || printableResources[id]);
      setShowModal(true);
    }
    if (!id || !(digitalResources[id] || printableResources[id])) {
      setModalContent(null);
      setShowModal(false);
    }
  }, [id]);

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
                />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
      )}
      <ResourceModal
        modalContent={modalContent}
        showModal={showModal}
      />
    </section>
  );
}

Resources.prototype = {
  hideDigitals: PropTypes.bool,
  hidePrintables: PropTypes.bool,
};

export default Resources;
