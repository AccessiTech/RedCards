import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import ErrorBoundary from './Components/ErrorBoundary/ErrorBoundary.jsx';
import App from './App/App.jsx'
import './scss/index.scss'

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
