import React, { useState } from "react";
import "./GuideCor.css";
import axios from "axios";

const GuideCor = () => {
  const [textQuestion3, setTextQuestion3] = useState("");
  const [yesNoQuestion, setYesNoQuestion] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Novo estado para mensagem de sucesso

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validação para garantir que todos os campos necessários estão preenchidos
    if (!yesNoQuestion || !textQuestion3) {
      setErrorMessage("Por favor, preencha todos os campos antes de enviar.");
      setTimeout(() => {
        setErrorMessage("");
      }, 4000);
      return;
    }

    setErrorMessage(""); // Limpa a mensagem de erro

    const currentDate = new Date().toISOString().split("T")[0];
    const formData = {
      coordenador: localStorage.getItem("coordenadorStorage"),
      date: currentDate,
      conformidade: yesNoQuestion,
      comentarios: textQuestion3,
    };

    axios
      .post(
        "https://softwareipmain-production.up.railway.app/guideCor",
        formData
      )
      .then(() => {
        // Exibe a mensagem de sucesso e reseta os campos
        setSuccessMessage("Dados enviados com sucesso!");
        setYesNoQuestion("");
        setTextQuestion3("");

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
      <h2>Avaliação de Conformidade com o Teachers Guide</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Conformidade com o Teachers Guide?</label>
          <div className="inputsGuide">
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
          <label htmlFor="textQuestion3">Comentários</label>
          <textarea
            name="textQuestion3"
            id="textQuestion3"
            placeholder="Fale mais"
            value={textQuestion3}
            onChange={(e) => setTextQuestion3(e.target.value)}
        ></textarea>
        </div>

        <button type="submit">Enviar</button>
      </form>
    </>
  );
};

export default GuideCor;
