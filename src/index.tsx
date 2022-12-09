import { ConfigProvider, theme } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';

const mediaQuery = window.matchMedia('(min-width: 700px)')
const algorithm = mediaQuery.matches ? theme.defaultAlgorithm : theme.compactAlgorithm;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
    <AuthProvider>
      <ConfigProvider
        theme={{
          algorithm: algorithm,
          token: {
            colorPrimary: "#6D1A64",
            fontFamily: "Courier"
          },
        }}
      >
        <App />
      </ConfigProvider>
    </AuthProvider >
  </BrowserRouter >
);
