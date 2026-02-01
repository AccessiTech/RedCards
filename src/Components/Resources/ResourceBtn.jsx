import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";

function ResourceBtn({ source, data }) {
  const navigate = useNavigate();
  return (
    <Button
      variant="primary"
      size="lg"
      className="resource-btn"
      href={data?.source}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        if (data?.links) {
          e.preventDefault();
          navigate(`/${source}`);
          // setModalContent({
          //   ...data,
          //   sourceName: source,
          // });
          // setShowModal(true);

        }
      }}
    >
      {data?.title}
    </Button>
  );
}

ResourceBtn.propTypes = {
  source: PropTypes.string,
  data: PropTypes.object,
};

export default ResourceBtn;
