import PropTypes from 'prop-types';
import './skipLink.scss';

/**
 * SkipLink component for accessibility
 * Provides keyboard users a way to skip repetitive navigation and jump to main content
 * 
 * @param {Object} props - Component props
 * @param {string} props.href - Target anchor ID (e.g., "#main-content")
 * @param {string} props.children - Link text (default: "Skip to main content")
 */
function SkipLink({ href = "#main-content", children = "Skip to main content" }) {
  return (
    <a 
      href={href}
      className="skip-link"
    >
      {children}
    </a>
  );
}

SkipLink.propTypes = {
  href: PropTypes.string,
  children: PropTypes.node,
};

export default SkipLink;
