import React, { useState, useEffect } from "react";
import "./FeiraCor.css";
import axios from "axios";

const FeiraCor = () => {
  const [unit, setUnit] = useState("");
  const [unidades, setUnidades] = useState([]);
  const [textQuestion1, setTextQuestion1] = useState("");
  const [textQuestion2, setTextQuestion2] = useState("");
  const [textQuestion3, setTextQuestion3] = useState("");
  const [textQuestion4, setTextQuestion4] = useState("");
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

    // Validação para garantir que todos os campos necessários estão preenchidos
    if (!unit || !textQuestion1 || !textQuestion2 || !textQuestion3 || !textQuestion4) {
      setErrorMessage("Por favor, preencha todos os campos antes de enviar.");
      setTimeout(() => setErrorMessage(""), 4000);
      return;
    }

    setErrorMessage(""); // Limpa a mensagem de erro

    const formData = {
      coordenador: coordenadorStorage,
      unidade: unit,
      cronograma: textQuestion1,
      estrutural: textQuestion2,
      apresentacao: textQuestion3,
      comentarios: textQuestion4,
      date: currentDate,
    };

    axios
      .post("https://softwareipmain-production.up.railway.app/feiraCor", formData)
      .then(() => {
        // Exibe a mensagem de sucesso e reseta os campos
        setSuccessMessage("Dados enviados com sucesso!");
        setUnit("");
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
              name="textQuestion4"
              id="textQuestion4"
              placeholder="Fale mais"
              value={textQuestion4}
              onChange={(e) => setTextQuestion4(e.target.value)}
            ></textarea>
          </div>

          <button type="submit">Enviar</button>
        </form>
      )}
    </>
  );
};

export default FeiraCor;
