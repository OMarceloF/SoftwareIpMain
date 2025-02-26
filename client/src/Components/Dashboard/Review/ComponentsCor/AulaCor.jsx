import React, { useState, useEffect } from "react";
import "./AulaCor.css";
import axios from "axios";

const AulaCor = () => {
  const [unit, setUnit] = useState("");
  const [unidades, setUnidades] = useState([]);
  const [rating, setRating] = useState(0);
  const [textQuestion2, setTextQuestion2] = useState("");
  const [competencias, setCompetencias] = useState([
    "Conformidade com o Teachers Guide",
    "Planejamento da Aula",
    "Oratótia do Professor",
    "Domínio do Tema",
    "Aplicação das habilidades e competencias",
    "Construção do Pensamento",
    "Postura do Professor",
    "Divisão do Tempo entre Teoria e Prática",
    "Criatividade",
    "Motivação do Professor",
    "Controle de Turma",
    "Atendimento aos Alunos",
    "Metodologia Ativa",
    "Nível de Atividade Proposta",
    "Time de Aula",
    "Motivação dos Alunos"
  ]);
  const [respostasCompetencias, setRespostasCompetencias] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const coordenadorStorage = localStorage.getItem("coordenadorStorage");

  useEffect(() => {
    if (!coordenadorStorage) {
      setErrorMessage("Erro: Coordenador não encontrado.");
      setLoading(false);
      return;
    }

    axios
      .get("https://softwareipmain-production.up.railway.app/unidades")
      .then((response) => {
        const unidadesFiltradas = response.data.filter(
          (unidade) => unidade.coordenador === coordenadorStorage
        );
        setUnidades(unidadesFiltradas);
      })
      .catch((error) => {
        console.error("Erro ao buscar unidades:", error);
        setErrorMessage("Erro ao carregar unidades. Tente novamente.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [coordenadorStorage]);

  const handleCompetenciaChange = (competencia, valor) => {
    setRespostasCompetencias((prev) => ({ ...prev, [competencia]: valor }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const currentDate = new Date().toISOString().split("T")[0];

    if (!rating || !textQuestion2 || !unit) {
      setErrorMessage("Por favor, preencha todos os campos antes de enviar.");
      setTimeout(() => setErrorMessage(""), 4000);
      return;
    }

    const todasCompetenciasPreenchidas = competencias.every(
      (comp) => respostasCompetencias[comp]
    );

    if (!todasCompetenciasPreenchidas) {
      setErrorMessage("Todas as competências devem ser avaliadas.");
      setTimeout(() => setErrorMessage(""), 4000);
      return;
    }

    setErrorMessage("");

    const formData = {
      date: currentDate,
      nota: rating,
      comentarios: textQuestion2,
      coordenador: coordenadorStorage,
      competencias: respostasCompetencias,
    };

    axios
      .post("https://softwareipmain-production.up.railway.app/aulacor", formData)
      .then(() => {
        setSuccessMessage("Dados enviados com sucesso!");
        setRating(0);
        setTextQuestion2("");
        setRespostasCompetencias({});
        setTimeout(() => setSuccessMessage(""), 4000);
      })
      .catch((error) => console.error("Erro ao enviar dados:", error));
  };

  return (
    <>
      <div className="title-form">
        <h2>Avaliação de Aulas Assistidas</h2>
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      {loading ? (
        <p>Carregando unidades...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="unit">Unidade:</label>
            <select id="unit" value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="">Selecione uma unidade</option>
              {unidades.map((unidade, index) => (
                <option key={index} value={unidade.cidade}>{unidade.cidade}</option>
              ))}
            </select>
          </div>

          <div>
            <h3>Avaliação das Competências</h3>
            {competencias.map((competencia, index) => (
              <div key={index} className="competencia-row">
                <span>{competencia}</span>
                <div className="competencia-options">
                  {["Atendeu", "Atendeu Parcialmente", "Não Atendeu"].map((opcao) => (
                    <label key={opcao}>
                      <input
                        type="radio"
                        name={competencia}
                        value={opcao}
                        checked={respostasCompetencias[competencia] === opcao}
                        onChange={(e) => handleCompetenciaChange(competencia, e.target.value)}
                      />
                      {opcao}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div>
            <label>Nota:</label>
            <div className="escolhaQuestion">
              {[...Array(11).keys()].map((number) => (
                <label key={number}>
                  <input
                    type="radio"
                    value={number}
                    checked={rating === number}
                    onChange={(e) => setRating(Number(e.target.value))}
                  />
                  {number}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="textQuestion2">Comentários</label>
            <textarea id="textQuestion2" placeholder="Fale mais" value={textQuestion2} onChange={(e) => setTextQuestion2(e.target.value)}></textarea>
          </div>

          <button type="submit">Enviar</button>
        </form>
      )}
    </>
  );
};

export default AulaCor;
