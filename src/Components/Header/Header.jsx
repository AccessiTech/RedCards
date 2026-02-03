import { useEffect, useRef, useState } from "react";
import { Col, Row, Button, Spinner } from "react-bootstrap";
import Translate from "../Translate/Translate";
import PropTypes from "prop-types";
import { getSacramentoPhoneNumber } from "../../config";
import { shareHandler } from "../../utils";
import { isOnline, onNetworkChange } from "../../utils/network";
import { cacheResources, isCached } from "../../utils/cache";

function Header({ title, lead, disableTranslate } = {}) {
  const deferredPromptRef = useRef(null);
  const [hideSaveButton, setHideSaveButton] = useState(false);
  const [online, setOnline] = useState(isOnline());
  const [caching, setCaching] = useState(false);
  const [cacheComplete, setCacheComplete] = useState(isCached());
  const norCalResistNumber = getSacramentoPhoneNumber();

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
    
    // Setup network change listener
    const cleanupNetwork = onNetworkChange(setOnline);
    
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      cleanupNetwork();
    };
  }, []);

  const handleSaveClick = async () => {
    // If already installed, trigger offline caching
    if (window.matchMedia("(display-mode: standalone)").matches) {
      if (cacheComplete) {
        alert("App is installed and offline resources are cached!");
        return;
      }
      
      if (!online) {
        alert("Please connect to the internet to download offline resources.");
        return;
      }

      // Cache resources for offline use
      setCaching(true);
      try {
        const result = await cacheResources();
        if (result.success && result.failed === 0) {
          setCacheComplete(true);
          alert(`Successfully cached ${result.cached} resources for offline use!`);
        } else {
          alert(`Cached ${result.cached} resources. ${result.failed} failed to cache.`);
        }
      } catch (error) {
        alert(`Failed to cache resources: ${error.message}`);
      } finally {
        setCaching(false);
      }
      return;
    }

    // Otherwise, show install prompt
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
  };

  return (
    <header>
      <Row>
        <Col style={{ textAlign: "center" }}>
          {/* Offline/Online Indicator */}
          {/* <div 
            style={{ 
              position: 'absolute', 
              display: 'none',
              top: '10px', 
              right: '10px',
              fontSize: '1.5rem',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
            title={online ? 'Online' : 'Offline'}
            aria-label={online ? 'Online' : 'Offline'}
            role="status"
          >
            {online ? '🟢' : '🔴'}
          </div> */}

          <Button
            href={
              `tel:${norCalResistNumber.replace(/[^0-9]/g, "")}`
            }
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            size="lg"
            className="report-ice-activity-btn w-100 fw-bold text-secondary"
            aria-label={`Report ICE Activity - Call ${norCalResistNumber}`}
          >
            REPORT ICE ACTIVITY<br />
            <span aria-hidden="true">📞</span> {norCalResistNumber ? norCalResistNumber : ""} <span aria-hidden="true">📞</span>
          </Button>
          <h1>{title || "Know Your Rights"}</h1>
          {lead && <p className="lead">{lead}</p>}
          {/* a button group with three buttons: Scan (which scrolls down to the QR Code), Save (which prompts the browser to save the page to the device homescreen), Share (which prompts the browser's default share functionality) */}
          <div className="mt-4 share-bar d-flex justify-content-center gap-4 mb-4">
            <Button 
              variant="outline-primary" 
              size="lg" 
              onClick={() => {
                const qrCodeSection = document.getElementById("qr-link");
                if (qrCodeSection) {
                  qrCodeSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
              aria-label="Scan QR code below"
            >
              Scan
            </Button>
            {!hideSaveButton && (
              <Button
                variant="outline-primary"
                size="lg"
                onClick={handleSaveClick}
                disabled={caching}
                aria-label={
                  window.matchMedia("(display-mode: standalone)").matches
                    ? "Download resources for offline use"
                    : "Save app for offline use"
                }
              >
                {caching ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </Button>
            )}
            <Button 
              variant="outline-primary" 
              size="lg" 
              onClick={async () => {
                await shareHandler({
                  shareUrl: window.location.href,
                  shareTitle: document.title,
                  onSuccess: (message) => {
                    // Show alert for clipboard copy (maintains original behavior)
                    if (message.includes("clipboard")) {
                      alert(message);
                    }
                  },
                  onError: (message) => {
                    // Show alert for errors (maintains original behavior)
                    alert(message.includes("Permission denied") ? message : `Share failed: ${message}`);
                  },
                });
              }}
              aria-label="Share this page"
            >
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
