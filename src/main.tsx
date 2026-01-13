import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import Modal from 'react-modal'
import { Provider } from "react-redux"
import { store, persistor } from './store/store.ts'
import { PersistGate } from "redux-persist/integration/react";

Modal.setAppElement('#root');
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>,
)
