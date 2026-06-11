const BASE_URL = 'http://localhost:5141';

export async function login(loginStr, senha) {
  const resposta = await fetch(`${BASE_URL}/api/Auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login: loginStr, senha: senha })
  });

  if (!resposta.ok) {
    const erro = await resposta.json();
    throw new Error(erro.mensagem || 'Erro ao fazer login.');
  }

  return resposta.json();
}

export async function registrarPonto(usuarioId, tipo, token) {
  const resposta = await fetch(`${BASE_URL}/api/Ponto`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ usuarioId: usuarioId, tipo: tipo })
  });

  if (!resposta.ok) throw new Error('Erro ao registrar ponto.');

  return resposta.json();
}

export async function buscarPontoHoje(usuarioId, token) {
  const resposta = await fetch(`${BASE_URL}/api/Ponto/hoje/${usuarioId}`, {
    headers: { 'Authorization': 'Bearer ' + token }
  });

  if (!resposta.ok) throw new Error('Erro ao buscar registros.');

  return resposta.json();
}

export async function buscarHistorico(usuarioId, token) {
  const resposta = await fetch(`${BASE_URL}/api/Ponto/historico/${usuarioId}`, {
    headers: { 'Authorization': 'Bearer ' + token }
  });

  if (!resposta.ok) throw new Error('Erro ao buscar historico.');

  return resposta.json();
}