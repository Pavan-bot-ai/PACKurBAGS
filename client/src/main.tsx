import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Global error handlers
window.addEventListener('unhandledrejection', (event) => {
  console.warn('Unhandled promise rejection:', event.reason);
  event.preventDefault(); // Prevent default browser error handling
});

window.addEventListener('error', (event) => {
  console.warn('Global error caught:', event.error);
});

createRoot(document.getElementById("root")!).render(<App />);
