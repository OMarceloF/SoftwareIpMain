import React, { useState, useEffect } from "react";
import "./ContatoCor.css";
import axios from "axios";

const ContatoCor = () => {
  const [unit, setUnit] = useState("");
  const [unidades, setUnidades] = useState([]);
  const [textQuestion2, setTextQuestion2] = useState("");
  const [yesNoQuestion, setYesNoQuestion] = useState("");
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

    if (!yesNoQuestion || !textQuestion2 || !unit) {
      setErrorMessage("Por favor, preencha todos os campos antes de enviar.");
      setTimeout(() => setErrorMessage(""), 4000);
      return;
    }

    setErrorMessage("");

    const currentDate = new Date().toISOString().split("T")[0];
    const formData = {
      date: currentDate,
      unidade: unit,
      retorno: yesNoQuestion,
      comentarios: textQuestion2,
      coordenador: coordenadorStorage,
    };

    axios
      .post("https://softwareipmain-production.up.railway.app/contatocor", formData)
      .then(() => {
        setSuccessMessage("Dados enviados com sucesso!");
        setUnit("");
        setYesNoQuestion("");
        setTextQuestion2("");
        setTimeout(() => setSuccessMessage(""), 4000);
      })
      .catch((error) => {
        console.error("Erro ao enviar dados:", error);
      });
  };

  return (
    <>
      <h2>Registro de Contato com Unidades</h2>
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
      )}
    </>
  );
};

export default ContatoCor;
