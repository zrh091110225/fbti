import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { initGA } from './utils/analytics'
import './styles.css'
import './components/ScenicBackdrop.css'

initGA()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
