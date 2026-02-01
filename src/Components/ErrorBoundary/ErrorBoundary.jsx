import React from "react";
import PropTypes from "prop-types";
import { Container, Alert, Button } from "react-bootstrap";
import "./errorBoundary.scss";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Store error details in state
    this.setState({
      error,
      errorInfo,
    });

    // Optional: Log to analytics service
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Optional: Send to error monitoring service (e.g., Sentry)
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  handleReportIssue = () => {
    const title = encodeURIComponent(
      `Error Report: ${this.state.error?.message || "Unknown error"}`
    );
    const body = encodeURIComponent(
      `**Error Description:**\n${this.state.error?.message || "Unknown error"}\n\n` +
        `**Stack Trace:**\n\`\`\`\n${this.state.error?.stack || "No stack trace"}\n\`\`\`\n\n` +
        `**Component Stack:**\n\`\`\`\n${this.state.errorInfo?.componentStack || "No component stack"}\n\`\`\`\n\n` +
        `**Browser:** ${navigator.userAgent}\n` +
        `**URL:** ${window.location.href}`
    );
    const issueUrl = `https://github.com/AccessiTech/RedCards/issues/new?title=${title}&body=${body}`;
    window.open(issueUrl, "_blank", "noopener,noreferrer");
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <Container className="error-boundary-container">
          <Alert variant="danger" className="error-boundary-alert">
            <Alert.Heading>
              <i className="fas fa-exclamation-triangle"></i> Something went
              wrong
            </Alert.Heading>
            <p>
              We're sorry, but something unexpected happened. The app has
              encountered an error and couldn't continue.
            </p>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="error-details">
                <hr />
                <h5>Error Details (Development Only):</h5>
                <pre className="error-message">
                  {this.state.error.toString()}
                </pre>
                {this.state.errorInfo && (
                  <details>
                    <summary>Component Stack</summary>
                    <pre className="error-stack">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <hr />

            <div className="error-actions">
              <Button
                variant="primary"
                onClick={this.handleReload}
                className="me-2"
              >
                <i className="fas fa-redo"></i> Reload Page
              </Button>
              <Button
                variant="outline-primary"
                onClick={this.handleGoHome}
                className="me-2"
              >
                <i className="fas fa-home"></i> Go Home
              </Button>
              <Button variant="outline-secondary" onClick={this.handleReportIssue}>
                <i className="fas fa-bug"></i> Report Issue
              </Button>
            </div>
          </Alert>
        </Container>
      );
    }

    // No error, render children normally
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
  onError: PropTypes.func,
};

export default ErrorBoundary;
