import { useState, useEffect } from 'react';
import { Toast, ToastContainer, Button } from 'react-bootstrap';
import './UpdatePrompt.scss';

/**
 * UpdatePrompt component for PWA service worker updates
 * Displays a non-blocking toast notification when a new version is available
 */
function UpdatePrompt({ show, onUpdate, onDismiss }) {
  const [showToast, setShowToast] = useState(show);

  useEffect(() => {
    setShowToast(show);
  }, [show]);

  const handleUpdate = () => {
    setShowToast(false);
    if (onUpdate) {
      onUpdate();
    }
  };

  const handleDismiss = () => {
    setShowToast(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <ToastContainer position="bottom-center" className="update-prompt-container">
      <Toast show={showToast} onClose={handleDismiss} className="update-prompt-toast">
        <Toast.Body className="update-prompt-body">
          <span className="update-prompt-message">New content is available.</span>
          <div className="update-prompt-actions">
            <Button 
              variant="success" 
              size="sm" 
              onClick={handleUpdate}
              className="update-prompt-reload"
            >
              Reload
            </Button>
            <Button 
              variant="outline-light" 
              size="sm" 
              onClick={handleDismiss}
              className="update-prompt-dismiss"
            >
              Later
            </Button>
          </div>
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

export default UpdatePrompt;
