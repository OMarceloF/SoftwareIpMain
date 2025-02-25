import React, { useState, useEffect } from "react";
import "./DiariosCor.css";
import axios from "axios";

const DiariosCor = () => {
  const [unit, setUnit] = useState("");
  const [unidades, setUnidades] = useState([]);
  const [rating, setRating] = useState(0);
  const [textQuestion2, setTextQuestion2] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Buscar coordenador salvo no localStorage
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
        // Filtrar unidades pelo coordenador
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
      unidade: unit,
      nota: rating,
      comentarios: textQuestion2,
      coordenador: coordenadorStorage,
    };

    axios
      .post("https://softwareipmain-production.up.railway.app/diariosCor", formData)
      .then(() => {
        setSuccessMessage("Dados enviados com sucesso!");
        setUnit("");
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
      <h2>Conferência e Avaliação de Diário</h2>
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

export default DiariosCor;
