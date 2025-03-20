import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { HeroUIProvider } from "@heroui/react"
import {Provider} from "react-redux";
import { PersistGate } from 'redux-persist/integration/react'
import { Store,persistor } from './stores/index.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={Store}>
      <PersistGate loading={null} persistor={persistor}>
        <HeroUIProvider>
          <App />
        </HeroUIProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
