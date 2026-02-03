import { Col, Nav, Row, Tab, Button } from "react-bootstrap";
import { attribution, leftHeader, rightHeader, leftColContent, rightColContent } from "./content";
import { regions } from "../../config";
import PropTypes from "prop-types";
import ResourceBtn from "../Resources/ResourceBtn";
import { useEffect, useState } from "react";
import ResourceModal from "../Resources/ResourceModal";
import { useParams } from "react-router";

// Transform regions config to match expected ctaData structure
const ctaSource = regions.source;
const ctaData = {
  url: regions.url,
  title: regions.title,
  description: regions.description,
  links: regions.networks.map((network, index) => {
    const isFirstInRegion = index === 0 || regions.networks[index - 1].region !== network.region;
    const displayNamePart = network.displayName ? ` (${network.displayName})` : '';
    const emailPart = network.email ? ` (${network.email})` : '';
    return {
      // Only add title for first network in a region
      ...(isFirstInRegion && { title: network.region }),
      description: network.name + displayNamePart + emailPart,
      descriptionLink: network.url,
      url: `tel:${network.phoneNumber}`,
      btnText: network.phoneNumber,
    };
  })
};

function Rights(props) {
  const { id } = useParams();
  const [modalContent, setModalContent] = useState(
    (id === ctaSource && ctaData) || null
  );
  const [showModal, setShowModal] = useState(id && modalContent ? true : false);

  useEffect(() => {
    if (id === ctaSource && ctaData) {
      setModalContent(ctaData);
      setShowModal(true);
    }
    if (id !== ctaSource) {
      setModalContent(null);
      setShowModal(false);
    }
  }, [id]);
  
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
          <ResourceBtn
            source={ctaSource}
            data={ctaData}
          />
        </Col>
      </Row>
      <ResourceModal
        showModal={showModal}
        modalContent={modalContent}
      />
    </section>
  );
}

Rights.propTypes = {
  ctaUrl: PropTypes.string,
  ctaTitle: PropTypes.string,
  leftHeader: PropTypes.string,
  rightHeader: PropTypes.string,
};

export default Rights;
