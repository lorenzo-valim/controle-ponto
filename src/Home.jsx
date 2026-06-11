import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { buscarPontoHoje, registrarPonto } from './api';
import "./Home.css";

// ─────────────────────────────────────────────────────────────────
// FUNÇÃO DE CÁLCULO FICA AQUI FORA (Melhor performance)
// ─────────────────────────────────────────────────────────────────
const calcularDiferenca = (horaInicio, horaFim) => {
    if (!horaInicio || !horaFim || horaFim === "-") return "-";

    const dataInicio = new Date(`1970-01-01T${horaInicio}`);
    const dataFim = new Date(`1970-01-01T${horaFim}`);

    let diferencaMs = dataFim - dataInicio;

    if (diferencaMs < 0) diferencaMs += 24 * 60 * 60 * 1000;

    const horas = Math.floor(diferencaMs / 3600000);
    const minutos = Math.floor((diferencaMs % 3600000) / 60000);
    const segundos = Math.floor((diferencaMs % 60000) / 1000);

    const h = String(horas).padStart(2, "0");
    const m = String(minutos).padStart(2, "0");
    const s = String(segundos).padStart(2, "0");

    return `${h}:${m}:${s}`;
};
// ─────────────────────────────────────────────────────────────────

function Home({ sessao }) {
    const navigate = useNavigate();
    const [registros, setRegistros] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Nomes dos tipos com base no número retornado pela API (0 a 3)
    const NOMES_TIPO = ['Entrada', 'Saída Almoço', 'Retorno Almoço', 'Saída Final'];

    useEffect(() => {
        if (!sessao) {
            navigate("/");
        }
    }, [sessao, navigate]);

    // 2. A TRAVA DE SEGURANÇA CRÍTICA:
    // Se a sessão for undefined ou null, interrompe o desenho da tela aqui 
    // e evita o erro de "usuarioId is undefined"
    if (!sessao) {
        return <div className="home-container"><p>Redirecionando...</p></div>;
    }

    // 3. BUSCA DOS DADOS (Só vai rodar se passou pela trava acima)
    useEffect(() => {
        buscarPontoHoje(sessao.usuarioId, sessao.token)
            .then(dados => setRegistros(dados))
            .catch(err => setError(err.message));
    }, [sessao]);

    // Descobre automaticamente qual é o próximo ponto a ser batido
    const obterProximoTipo = () => {
        const quantidade = registros.length;
        if (quantidade >= 4) return null; // Já bateu os 4 pontos do dia
        return quantidade; // Retorna 0, 1, 2 ou 3
    };

    // Função assíncrona para registrar o ponto na API
    async function handleRegistrarPonto() {
        const proximoTipo = obterProximoTipo();
        
        if (proximoTipo === null) {
            alert("Você já realizou todos os registros de ponto permitidos para hoje!");
            return;
        }

        try {
            setLoading(true);
            setError("");
            
            // Envia para a API o ID do usuário, o número do tipo do ponto e o Token de autenticação
            const novoRegistro = await registrarPonto(sessao.usuarioId, proximoTipo, sessao.token);
            
            // Adiciona o novo registro vindo da API no estado local
            setRegistros(prev => [...prev, novoRegistro]);
        } catch (err) {
            setError(err.message || "Erro ao registrar ponto.");
        } finally {
            setLoading(false);
        }
    }

    const proximoTipo = obterProximoTipo();

    return (
        <div className="home-container">
            <h1 className="home-title">Painel do Funcionário</h1>
            {sessao && <p className="welcome-text">Bem-vindo(a), {sessao.nome}!</p>}

            {error && (
                <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', borderRadius: '8px', padding: '10px', marginBottom: '16px' }}>
                    {error}
                </div>
            )}

            <div className="action-buttons">
                <button 
                    className="btn btn-register" 
                    onClick={handleRegistrarPonto} 
                    disabled={loading || proximoTipo === null}
                >
                    {loading ? 'Processando...' : `⏱ Bater ${proximoTipo !== null ? NOMES_TIPO[proximoTipo] : 'Ponto'}`}
                </button>
            </div>

            <div className="history-card">
                <h3>Histórico de hoje</h3>
                {registros.length === 0 ? (
                    <p className="empty-text">Nenhum ponto registrado ainda.</p>
                ) : (
                    <table className="ponto-table">
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Registro (Tipo)</th>
                                <th>Horário</th>
                                <th>Intervalo / Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registros.map((ponto, index) => {
                                // Converte a string de data da API ("2026-06-10T08:00:00") para Date do JS
                                const dataObjeto = new Date(ponto.dataHora);
                                const horario = dataObjeto.toLocaleTimeString('pt-BR');
                                const dataFormatada = dataObjeto.toLocaleDateString('pt-BR');

                                // Calcula a diferença com o ponto anterior se houver
                                let tempoDecorrido = "-";
                                if (index > 0) {
                                    const horaAnterior = new Date(registros[index - 1].dataHora).toLocaleTimeString('pt-BR');
                                    tempoDecorrido = calcularDiferenca(horaAnterior, horario);
                                }

                                return (
                                    <tr key={ponto.id || index}>
                                        <td>{dataFormatada}</td>
                                        <td><strong>{NOMES_TIPO[ponto.tipo]}</strong></td>
                                        <td>{horario}</td>
                                        <td>{tempoDecorrido}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            <hr className="divider" />

            <button className="btn-logout" onClick={() => navigate("/")}>
                Sair do Sistema
            </button>
        </div>
    );
}

export default Home;