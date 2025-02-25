import React, { useState } from "react";
import "./FeiraCor.css";
import axios from "axios";

const FeiraCor = () => {
  const [textQuestion1, setTextQuestion1] = useState("");
  const [textQuestion2, setTextQuestion2] = useState("");
  const [textQuestion3, setTextQuestion3] = useState("");
  const [textQuestion4, setTextQuestion4] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Novo estado para mensagem de sucesso

  const handleSubmit = (event) => {
    event.preventDefault();

    const currentDate = new Date().toISOString().split("T")[0];

    // Validação para garantir que todos os campos necessários estão preenchidos
    if (!textQuestion1 || !textQuestion2 || !textQuestion3 || !textQuestion4) {
      setErrorMessage("Por favor, preencha todos os campos antes de enviar.");
      setTimeout(() => {
        setErrorMessage("");
      }, 4000);
      return;
    }

    setErrorMessage(""); // Limpa a mensagem de erro

    const formData = {
      coordenador: localStorage.getItem("coordenadorStorage"),
      cronograma: textQuestion1,
      estrutural: textQuestion2,
      apresentacao: textQuestion3,
      comentarios: textQuestion4,
      date: currentDate,
    };

    axios
      .post(
        "https://softwareipmain-production.up.railway.app/feiraCor",
        formData
      )
      .then(() => {
        // Exibe a mensagem de sucesso e reseta os campos
        setSuccessMessage("Dados enviados com sucesso!");
        setTextQuestion1("");
        setTextQuestion2("");
        setTextQuestion3("");
        setTextQuestion4("");

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
      <h2>Acompanhamento de Feiras</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Cronograma</label>
          <div className="inputsInventario">
            <label>
              <input
                type="radio"
                value="Sim"
                checked={textQuestion1 === "Sim"}
                onChange={(e) => setTextQuestion1(e.target.value)}
              />
              Sim
            </label>
            <label>
              <input
                type="radio"
                value="Não"
                checked={textQuestion1 === "Não"}
                onChange={(e) => setTextQuestion1(e.target.value)}
              />
              Não
            </label>
          </div>
        </div>

        <div>
          <label>Estrutural</label>
          <div className="inputsInventario">
            <label>
              <input
                type="radio"
                value="Sim"
                checked={textQuestion2 === "Sim"}
                onChange={(e) => setTextQuestion2(e.target.value)}
              />
              Sim
            </label>
            <label>
              <input
                type="radio"
                value="Não"
                checked={textQuestion2 === "Não"}
                onChange={(e) => setTextQuestion2(e.target.value)}
              />
              Não
            </label>
          </div>
        </div>

        <div>
          <label>Apresentação</label>
          <div className="inputsInventario">
            <label>
              <input
                type="radio"
                value="Sim"
                checked={textQuestion3 === "Sim"}
                onChange={(e) => setTextQuestion3(e.target.value)}
              />
              Sim
            </label>
            <label>
              <input
                type="radio"
                value="Não"
                checked={textQuestion3 === "Não"}
                onChange={(e) => setTextQuestion3(e.target.value)}
              />
              Não
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="textQuestion4">Comentários</label>
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

export default FeiraCor;
