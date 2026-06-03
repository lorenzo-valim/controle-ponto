import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername]     = useState('');
  const [password, setPassword]     = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');

  // Preenche campos se "Lembrar-me" estava marcado
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');
    if (storedUsername && storedPassword) {
      setUsername(storedUsername);
      setPassword(storedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Por favor, preencha o usuário e a senha.');
      return;
    }

    if (rememberMe) {
      localStorage.setItem('username', username);
      localStorage.setItem('password', password);
    } else {
      localStorage.removeItem('username');
      localStorage.removeItem('password');
    }

    // Redireciona para a tela Home com sucesso!
    navigate('/home');
  };

  return (
    <div className="login-wrapper">
      <div className="login-form-container">
        <h1 className="login-title">Login</h1>
        <p className="login-subtitle">Insira suas credenciais</p>

        {error && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fca5a5',
            color: '#b91c1c',
            borderRadius: '8px',
            padding: '10px 14px',
            marginBottom: '16px',
            fontSize: '14px',
          }}>
            {error}
          </div>
        )}

        <Form className="login-form" onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Control
              type="text"
              placeholder="Usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check
              type="checkbox"
              label="Lembrar-me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
          </Form.Group>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px' }}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </Form>
      </div>
    </div>
  );
}

export default Login;