import React, { useState } from "react";
import "./AulaCor.css";
import axios from "axios";

const AulaCor = () => {
  const [unit, setUnit] = useState("");
  const [unidades, setUnidades] = useState([]);
  const [rating, setRating] = useState(0);
  const [textQuestion2, setTextQuestion2] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [unidadesCarregadas, setUnidadesCarregadas] = useState(false);

  // Função para buscar unidades do banco de dados
  const fetchUnidades = () => {
    setLoading(true);
    axios
      .get("https://softwareipmain-production.up.railway.app/unidades")
      .then((response) => {
        setUnidades(response.data);
        setUnidadesCarregadas(true);
      })
      .catch((error) => {
        console.error("Erro ao buscar unidades:", error);
        setErrorMessage("Erro ao carregar unidades. Tente novamente.");
        setTimeout(() => setErrorMessage(""), 4000);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const currentDate = new Date().toISOString().split("T")[0];

    if (!rating || !textQuestion2 || !unit) {
      setErrorMessage("Por favor, preencha todos os campos antes de enviar.");
      setTimeout(() => setErrorMessage(""), 4000);
      return;
    }

    setErrorMessage("");

    const formData = {
      date: currentDate,
      nota: rating,
      comentarios: textQuestion2,
      coordenador: localStorage.getItem("coordenadorStorage"),
    };

    axios
      .post("https://softwareipmain-production.up.railway.app/aulacor", formData)
      .then(() => {
        setSuccessMessage("Dados enviados com sucesso!");
        setRating(0);
        setTextQuestion2("");
        setTimeout(() => setSuccessMessage(""), 4000);
      })
      .catch((error) => {
        console.error("Erro ao enviar dados:", error);
      });
  };

  return (
    <>
      <div className="title-form">
        <h2>Avaliação de Aulas Assistidas</h2>
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      {/* Botão para carregar unidades antes de exibir o formulário */}
      {!unidadesCarregadas ? (
        <button onClick={fetchUnidades} disabled={loading}>
          {loading ? "Carregando..." : "Carregar Unidades"}
        </button>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="unit">Unidade:</label>
            <select id="unit" value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="">Selecione uma unidade</option>
              {unidades.map((unidade, index) => (
                <option key={index} value={unidade.cidade}>
                  {unidade.cidade}
                </option>
              ))}
            </select>
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
            <textarea
              name="textQuestion2"
              id="textQuestion2"
              placeholder="Fale mais"
              value={textQuestion2}
              onChange={(e) => setTextQuestion2(e.target.value)}
            ></textarea>
          </div>

          <button type="submit">Enviar</button>
        </form>
      )}
    </>
  );
};

export default AulaCor;
