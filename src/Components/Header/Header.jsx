import { useEffect, useRef, useState } from "react";
import { Col, Row, Button } from "react-bootstrap";
import Translate from "../Translate/Translate";
import PropTypes from "prop-types";
import { norCalResistNumber } from "../Rights/content";

function Header({ title, lead, disableTranslate } = {}) {
  const deferredPromptRef = useRef(null);
  const [hideSaveButton, setHideSaveButton] = useState(false);
  const [shareStatus, setShareStatus] = useState({ type: null, message: "" });

  useEffect(() => {
    function handleBeforeInstallPrompt(event) {
      // Prevent the browser from automatically showing the prompt.
      event.preventDefault();

      // Stash the event so it can be triggered later from a user gesture.
      deferredPromptRef.current = event;

      // Keep backward compatibility with the previous implementation.
      window.beforeInstallPrompt = event;
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  return (
    <header>
      <Row>
        <Col style={{ textAlign: "center" }}>
          <Button
            href={
              `tel:${norCalResistNumber.replace(/[^0-9]/g, "")}`
            }
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            size="lg"
            className="report-ice-activity-btn w-100 fw-bold text-secondary"
          >
            REPORT ICE ACTIVITY<br />
            { `📞 ${norCalResistNumber ? norCalResistNumber : ""} 📞` }
          </Button>
          <h1>{title || "Know Your Rights"}</h1>
          {lead && <p className="lead">{lead}</p>}
          {/* a button group with three buttons: Scan (which scrolls down to the QR Code), Save (which prompts the browser to save the page to the device homescreen), Share (which prompts the browser's default share functionality) */}
          <div className="mt-4 share-bar d-flex justify-content-center gap-4 mb-4">
            <Button variant="outline-primary" size="lg" onClick={() => {
              const qrCodeSection = document.getElementById("qr-link");
              if (qrCodeSection) {
                qrCodeSection.scrollIntoView({ behavior: "smooth" });
              }
            }}>
              Scan
            </Button>
            {!hideSaveButton && (
              <Button
                variant="outline-primary"
                size="lg"
                onClick={() => {
                  if (window.matchMedia("(display-mode: standalone)").matches) {
                    alert("This app is already installed.");
                    return;
                  }

                  const deferredPrompt = deferredPromptRef.current || window.beforeInstallPrompt;
                  if (!deferredPrompt) {
                    alert("To install this app, please use your browser's 'Add to Home Screen' option.");
                    return;
                  }

                  // Installation must be done by a user gesture.
                  // Hide the UI that shows our A2HS button (matches the referenced snippet behavior).
                  setHideSaveButton(true);

                  // Show the prompt
                  deferredPrompt.prompt();

                  // Wait for the user to respond to the prompt
                  if (deferredPrompt.userChoice && typeof deferredPrompt.userChoice.then === "function") {
                    deferredPrompt.userChoice.then((choiceResult) => {
                      if (choiceResult?.outcome === "accepted") {
                        console.log("User accepted the A2HS prompt");
                        // Keep the button hidden after successful install intent.
                      } else {
                        console.log("User dismissed the A2HS prompt");
                        // Re-show the button if the user dismissed the prompt.
                        setHideSaveButton(false);
                      }

                      deferredPromptRef.current = null;
                      window.beforeInstallPrompt = null;
                    });
                  } else {
                    deferredPromptRef.current = null;
                    window.beforeInstallPrompt = null;
                    setHideSaveButton(false);
                  }
                }}
              >
                Save
              </Button>
            )}
            <Button variant="outline-primary" size="lg" onClick={async () => {
              setShareStatus({ type: "loading", message: "" });
              
              try {
                // Feature detection
                if (!navigator.share && (!navigator.clipboard || !navigator.clipboard.writeText)) {
                  throw new Error("Share and Clipboard APIs are not supported in this browser");
                }

                if (navigator.share) {
                  await navigator.share({
                    title: document.title,
                    url: window.location.href,
                  });
                  setShareStatus({ type: "success", message: "Thanks for sharing!" });
                } else {
                  // Fallback to clipboard
                  await navigator.clipboard.writeText(window.location.href);
                  setShareStatus({ type: "success", message: "Link copied to clipboard" });
                  alert("Link copied to clipboard");
                }

                // Clear success message after 3 seconds
                setTimeout(() => setShareStatus({ type: null, message: "" }), 3000);
              } catch (error) {
                // User cancelled share dialog (not an error)
                if (error.name === "AbortError") {
                  setShareStatus({ type: null, message: "" });
                  return;
                }

                // Permission denied for clipboard
                if (error.name === "NotAllowedError") {
                  const message = "Permission denied. Please allow clipboard access.";
                  setShareStatus({ type: "error", message });
                  alert(message);
                  return;
                }

                // Other errors
                const message = error.message || "Unable to share. Please try again.";
                setShareStatus({ type: "error", message });
                alert(`Share failed: ${message}`);
                console.error("Share failed:", error);
              }
            }}>
              Share
            </Button>

          
          </div>
          {!disableTranslate && <Translate />}
        </Col>
      </Row>
    </header>
  );
}

Header.propTypes = {
  title: PropTypes.string,
  lead: PropTypes.string,
  disableTranslate: PropTypes.bool,
};

export default Header;
