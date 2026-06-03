import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

// ─────────────────────────────────────────────────────────────────
// FUNÇÃO DE CÁLCULO FICA AQUI FORA (Melhor performance)
// ─────────────────────────────────────────────────────────────────
const calcularDiferenca = (horaInicio, horaFim) => {
    if (!horaInicio || !horaFim) return "-";

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

function Home() {
    const navigate = useNavigate();

    const [registros, setRegistros] = useState(() => {
        const salvos = localStorage.getItem("registro_pontos");
        return salvos ? JSON.parse(salvos) : [];
    });

    useEffect(() => {
        localStorage.setItem("registro_pontos", JSON.stringify(registros));
    }, [registros]);

    const registrarPonto = () => {
        const agora = new Date();
        const horarioFormatado = agora.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });

        setRegistros([...registros, horarioFormatado]);
    };

    const limparHistorico = () => {
        if (window.confirm("Deseja apagar todos os registros?")) {
            setRegistros([]);
        }
    };

    return (
        <div className="home-container">
            <h1 className="home-title">Painel do Funcionário</h1>

            <div className="action-buttons">
                <button className="btn btn-register" onClick={registrarPonto}>
                    ⏱ Bater Ponto
                </button>

                <button className="btn btn-clear" onClick={limparHistorico}>
                    🧹 Limpar Tudo
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
                                <th>Entrada</th>
                                <th>Saída</th>
                                <th>Total Horas</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registros.map((ponto, index) => {
                                if (index % 2 !== 0) return null;

                                const entrada = ponto;


                                const saida = registros[index + 1];

                                


                                const tempoDecorrido = calcularDiferenca(entrada, saida);

                                return (
                                    <tr key={index}>
                                        <td>{new Date().toLocaleDateString("pt-BR")}</td>
                                        <td>{entrada}</td>
                                        <td>{saida ? saida : "-"}</td>
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