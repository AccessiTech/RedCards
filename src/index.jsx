import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import ErrorBoundary from './Components/ErrorBoundary/ErrorBoundary.jsx';
import App from './App/App.jsx'
import './scss/index.scss'
import { registerSW } from 'virtual:pwa-register';

// Register service worker with auto-update
const updateSW = registerSW({
  onNeedRefresh() {
    // TODO: Phase 2.3 - Show update prompt to user
    if (confirm('New content available. Reload to update?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('App ready to work offline');
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
