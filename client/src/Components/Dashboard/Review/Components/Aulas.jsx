import React, { useState, useEffect } from "react";
import "../../../../App.css";
import "./Aulas.css";
import axios from "axios";

const Aulas = () => {
  const [unit, setUnit] = useState("");
  const [rating, setRating] = useState(0);
  const [textQuestion1, setTextQuestion1] = useState("");
  const [textQuestion2, setTextQuestion2] = useState("");
  const [unidades, setUnidades] = useState([]);
  const [coordenador, setCoordenador] = useState("");
  const [competencias, setCompetencias] = useState([
    "Domínio do conteúdo",
    "Didática",
    "Clareza na explicação",
    "Interação com os alunos",
    "Uso de recursos didáticos"
  ]);
  const [respostasCompetencias, setRespostasCompetencias] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const email = localStorage.getItem("emailStorage");

  useEffect(() => {
    if (!email) {
      setErrorMessage("Usuário não autenticado.");
      return;
    }

    axios
      .get(`https://softwareipmain-production.up.railway.app/getUsername/${email}`)
      .then((response) => {
        const nomeCoordenador = response.data.name;
        setCoordenador(nomeCoordenador);

        axios
          .get("https://softwareipmain-production.up.railway.app/unidades")
          .then((response) => {
            const unidadesFiltradas = response.data.filter(
              (unidade) => unidade.coordenador === nomeCoordenador
            );
            setUnidades(unidadesFiltradas);
          })
          .catch((error) => console.error("Erro ao buscar unidades:", error));
      })
      .catch((error) => console.error("Erro ao obter coordenador:", error));
  }, [email]);

  const handleCompetenciaChange = (competencia, valor) => {
    setRespostasCompetencias((prev) => ({ ...prev, [competencia]: valor }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const currentDate = new Date().toISOString().split("T")[0];

    if (!unit || !rating || !textQuestion1 || !textQuestion2) {
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
      unidade: unit,
      regente: textQuestion1,
      nota: rating,
      comentarios: textQuestion2,
      competencias: respostasCompetencias,
    };

    axios
      .post("https://softwareipmain-production.up.railway.app/aula", formData)
      .then(() => {
        setSuccessMessage("Dados enviados com sucesso!");
        setUnit("");
        setRating(0);
        setTextQuestion1("");
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
          <label htmlFor="textQuestion1">Regente</label>
          <input type="text" id="textQuestion1" value={textQuestion1} onChange={(e) => setTextQuestion1(e.target.value)} />
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
    </>
  );
};

export default Aulas;
