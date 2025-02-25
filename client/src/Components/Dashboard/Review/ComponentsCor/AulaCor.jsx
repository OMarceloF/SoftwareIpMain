import React, { useState } from "react";
import "./AulaCor.css";
import axios from "axios";

const AulaCor = () => {
  const [unit, setUnit] = useState("");
  const [unidades, setUnidades] = useState([]);
  const [rating, setRating] = useState(0);
  const [textQuestion2, setTextQuestion2] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Novo estado para mensagem de sucesso

  const handleSubmit = (event) => {
    event.preventDefault();
    const currentDate = new Date().toISOString().split("T")[0];

    if (!rating || !textQuestion2 || !unit) {
      setErrorMessage("Por favor, preencha todos os campos antes de enviar.");
      setTimeout(() => {
        setErrorMessage("");
      }, 4000);
      return;
    }

    setErrorMessage(""); // Limpa a mensagem de erro

    const formData = {
      date: currentDate,
      nota: rating,
      comentarios: textQuestion2,
      coordenador: localStorage.getItem("coordenadorStorage"),
    };

    axios
      .post(
        "https://softwareipmain-production.up.railway.app/aulacor",
        formData
      )
      .then(() => {
        // Exibe a mensagem de sucesso e reseta os campos
        setSuccessMessage("Dados enviados com sucesso!");
        setRating(0);
        setTextQuestion2("");

        // Remove a mensagem após 4 segundos
        setTimeout(() => {
          setSuccessMessage("");
        }, 4000);
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
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      <form onSubmit={handleSubmit}>
      <div>
          <label htmlFor="unit">Unidade:</label>
          <select
            id="unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          >
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
    </>
  );
};

export default AulaCor;
