import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { NextUIProvider } from '@nextui-org/react'
import { PrimeReactProvider } from 'primereact/api';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NextUIProvider>
      <PrimeReactProvider>
        <App />
      </PrimeReactProvider>
    </NextUIProvider>
  </React.StrictMode>,
)
