import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { login } from './api';

function Login({ setSessao }) {
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

 async function handleLogin(event) {
    event.preventDefault(); // Evita o reload da página imediatamente
    setError('');

    if (!username || !password) {
      setError('Por favor, preencha o usuário e a senha.');
      return;
    }

    try {
      setLoading(true);
      
      // 1. Faz a requisição real para a API através do api.js
      const dados = await login(username, password); 
      
      // 2. Salva os dados retornados (token, usuarioId, nome) no estado
      setSessao({ token: dados.token, usuarioId: dados.usuarioId, nome: dados.nome });
      
      // 3. Trata o recurso "Lembrar-me"
      if (rememberMe) {
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
      } else {
        localStorage.removeItem('username');
        localStorage.removeItem('password');
      }

      // 4. Se chegou até aqui sem dar erro, o login foi um sucesso! Redireciona:
      navigate('/home');

    } catch (err) {
      // Se a API retornar 401 (Incorreto) ou der erro de rede, cai aqui:
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

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

        <Form className="login-form" onSubmit={handleLogin}>
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