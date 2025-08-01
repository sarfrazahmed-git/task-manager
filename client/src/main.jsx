import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Contextprovider } from "./context/usercontext"
import { BrowserRouter, Routes, Route  } from 'react-router-dom'
import Login from './components/login.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Contextprovider>
      <Routes>
        <Route path="/login" element={<Login/>} />
      </Routes>
    <App />
    </Contextprovider>
    </BrowserRouter>
  </StrictMode>,
)
