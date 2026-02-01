import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import ErrorBoundary from './Components/ErrorBoundary/ErrorBoundary.jsx';
import App from './App/App.jsx'
import './scss/index.scss'
import { registerSW } from 'virtual:pwa-register';

// Custom update prompt to avoid blocking browser confirm dialogs
const showUpdatePrompt = (onConfirm) => {
  // Avoid rendering multiple prompts
  if (document.getElementById('sw-update-prompt')) {
    return;
  }

  const prompt = document.createElement('div');
  prompt.id = 'sw-update-prompt';
  prompt.style.position = 'fixed';
  prompt.style.left = '50%';
  prompt.style.bottom = '16px';
  prompt.style.transform = 'translateX(-50%)';
  prompt.style.zIndex = '9999';
  prompt.style.background = '#333';
  prompt.style.color = '#fff';
  prompt.style.padding = '12px 16px';
  prompt.style.borderRadius = '4px';
  prompt.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
  prompt.style.display = 'flex';
  prompt.style.alignItems = 'center';
  prompt.style.gap = '8px';
  prompt.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

  const message = document.createElement('span');
  message.textContent = 'New content is available.';

  const reloadButton = document.createElement('button');
  reloadButton.type = 'button';
  reloadButton.textContent = 'Reload';
  reloadButton.style.background = '#4caf50';
  reloadButton.style.color = '#fff';
  reloadButton.style.border = 'none';
  reloadButton.style.borderRadius = '3px';
  reloadButton.style.padding = '6px 10px';
  reloadButton.style.cursor = 'pointer';

  const dismissButton = document.createElement('button');
  dismissButton.type = 'button';
  dismissButton.textContent = 'Later';
  dismissButton.style.background = 'transparent';
  dismissButton.style.color = '#fff';
  dismissButton.style.border = '1px solid #777';
  dismissButton.style.borderRadius = '3px';
  dismissButton.style.padding = '6px 10px';
  dismissButton.style.cursor = 'pointer';

  const removePrompt = () => {
    if (prompt.parentNode) {
      prompt.parentNode.removeChild(prompt);
    }
  };

  reloadButton.addEventListener('click', () => {
    removePrompt();
    if (typeof onConfirm === 'function') {
      onConfirm();
    }
  });

  dismissButton.addEventListener('click', () => {
    removePrompt();
  });

  prompt.appendChild(message);
  prompt.appendChild(reloadButton);
  prompt.appendChild(dismissButton);
  document.body.appendChild(prompt);
};

// Register service worker with auto-update
const updateSW = registerSW({
  onNeedRefresh() {
    // Show custom update prompt to user instead of blocking browser confirm dialog
    showUpdatePrompt(() => {
      updateSW(true);
    });
  },
  onOfflineReady() {
    if (process.env.NODE_ENV === 'development') {
      console.log('App ready to work offline');
    }
  },
});

// Optional: Global error handler for analytics
const handleError = (error, errorInfo) => {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Global Error Handler:', error, errorInfo);
  }
  
  // TODO: Send to analytics service in production
  // Example: analytics.logError({ error, errorInfo });
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <ErrorBoundary onError={handleError}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/:id" element={<App />} />
      </Routes>
    </BrowserRouter>
  </ErrorBoundary>
);
