import React, { useState } from 'react'; 
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './Home.jsx'
import Login from './Login.jsx'

function RootApp() {
  const [sessao, setSessao] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login setSessao={setSessao} />} />
        <Route path="/home" element={<Home sessao={sessao} />} />
      </Routes>
    </BrowserRouter>
  );
}

// Renderiza o componente que acabamos de criar
createRoot(document.getElementById('root')).render(<RootApp />);
