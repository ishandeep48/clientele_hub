import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import reportWebVitals from './reportWebVitals';
import { ModalProvider } from './context/ModalContext.tsx'; // ✅ Import this

const rootElement = document.getElementById('root') as HTMLElement;

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ModalProvider> {/* ✅ Wrap App inside ModalProvider */}
        <App />
      </ModalProvider>
    </React.StrictMode>
  );
} else {
  console.error('Root element with ID "root" not found in the document.');
}

reportWebVitals();
