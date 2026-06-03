import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './Home.jsx'
import Login from './Login.jsx'

createRoot(document.getElementById('root')).render(
 <BrowserRouter>
   <Routes>
  <Route path="/" element={<Login />} />
  <Route path="/home" element={<Home />} />
  </Routes> 
  </BrowserRouter>
)
