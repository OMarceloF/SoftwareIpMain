import React, { useState } from "react";
import "./ContatoCor.css";
import axios from "axios";

const ContatoCor = () => {
  const [textQuestion2, setTextQuestion2] = useState("");
  const [yesNoQuestion, setYesNoQuestion] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Novo estado para mensagem de sucesso

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!yesNoQuestion || !textQuestion2) {
      setErrorMessage("Por favor, preencha todos os campos antes de enviar.");
      setTimeout(() => {
        setErrorMessage("");
      }, 4000);
      return;
    }

    setErrorMessage(""); // Limpa a mensagem de erro

    const currentDate = new Date().toISOString().split("T")[0];
    const formData = {
      date: currentDate,
      retorno: yesNoQuestion,
      comentarios: textQuestion2,
      coordenador: localStorage.getItem("coordenadorStorage"),
    };

    axios
      .post(
        "https://softwareipmain-production.up.railway.app/contatocor",
        formData
      )
      .then(() => {
        // Exibe a mensagem de sucesso e reseta os campos
        setSuccessMessage("Dados enviados com sucesso!");
        setYesNoQuestion("");
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
      <h2>Registro de Contato com Unidades</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Retorno?</label>
          <div className="inputsRetorno">
            <label>
              <input
                type="radio"
                value="Sim"
                checked={yesNoQuestion === "Sim"}
                onChange={(e) => setYesNoQuestion(e.target.value)}
              />
              Sim
            </label>
            <label>
              <input
                type="radio"
                value="Não"
                checked={yesNoQuestion === "Não"}
                onChange={(e) => setYesNoQuestion(e.target.value)}
              />
              Não
            </label>
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

export default ContatoCor;
