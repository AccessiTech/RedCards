import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router";
import UpdatePrompt from '../Components/UpdatePrompt/UpdatePrompt.jsx';
import App from '../App/App.jsx';
import { registerSW } from 'virtual:pwa-register';

// Root component that manages service worker update state
export function Root() {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [updateSWCallback, setUpdateSWCallback] = useState(null);

  // Register service worker with auto-update
  React.useEffect(() => {
    const updateSW = registerSW({
      onNeedRefresh() {
        // Store the update callback and show the React-based update prompt
        setUpdateSWCallback(() => () => updateSW(true));
        setShowUpdatePrompt(true);
      },
      onOfflineReady() {
        if (process.env.NODE_ENV === 'development') {
          console.log('App ready to work offline');
        }
      },
    });
  }, []);

  const handleUpdate = () => {
    setShowUpdatePrompt(false);
    if (updateSWCallback) {
      updateSWCallback();
    }
  };

  const handleDismiss = () => {
    setShowUpdatePrompt(false);
  };

  return (
    <>
      <UpdatePrompt 
        show={showUpdatePrompt} 
        onUpdate={handleUpdate} 
        onDismiss={handleDismiss} 
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/:id" element={<App />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default Root;
