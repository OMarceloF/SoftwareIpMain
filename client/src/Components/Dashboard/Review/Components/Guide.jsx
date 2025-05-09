import React, { useState, useEffect } from "react";
import "../../../../App.css";
import "./Guide.css";
import axios from "axios";

const Guide = () => {
  const [unit, setUnit] = useState("");
  const [textQuestion3, setTextQuestion3] = useState("");
  const [yesNoQuestion, setYesNoQuestion] = useState("");
  const [unidades, setUnidades] = useState([]);
  const [turmaQuestion, setturmaQuestion] = useState("");
  const [coordenador, setCoordenador] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Obtendo o email do usuário logado
  const email = localStorage.getItem("emailStorage");

  useEffect(() => {
    if (!email) {
      setErrorMessage("Usuário não autenticado.");
      return;
    }

    // Buscar o nome do coordenador com base no email
    axios
      .get(
        `https://softwareipmain-production.up.railway.app/getUsername/${email}`
        //`http://localhost:3002/getUsername/${email}`
      )
      .then((response) => {
        const nomeCoordenador = response.data.name;
        setCoordenador(nomeCoordenador);

        // Buscar as unidades e filtrar apenas as que pertencem ao coordenador logado
        axios
          .get("https://softwareipmain-production.up.railway.app/unidades")
          //.get("http://localhost:3002/unidades")
          .then((response) => {
            const unidadesFiltradas = response.data.filter(
              (unidade) => unidade.coordenador === nomeCoordenador
            );
            setUnidades(unidadesFiltradas);
          })
          .catch((error) => {
            console.error("Erro ao buscar unidades:", error);
          });
      })
      .catch((error) => {
        console.error("Erro ao obter coordenador:", error);
      });
  }, [email]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!unit || turmaQuestion === "" || !yesNoQuestion || !textQuestion3) {
      setErrorMessage("Por favor, preencha todos os campos antes de enviar.");
      setTimeout(() => {
        setErrorMessage("");
      }, 4000);
      return;
    }

    setErrorMessage("");

    const currentDate = new Date().toISOString().split("T")[0];
    const formData = {
      date: currentDate,
      unidade: unit,
      turma: turmaQuestion,
      conformidade: yesNoQuestion,
      comentarios: textQuestion3,
    };

    axios
      .post("https://softwareipmain-production.up.railway.app/guide", formData)
      //.post("http://localhost:3002/guide", formData)
      .then(() => {
        setSuccessMessage("Dados enviados com sucesso!");
        setUnit("");
        setturmaQuestion("");
        setYesNoQuestion("");
        setTextQuestion3("");

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
          <label htmlFor="turmaQuestion">Turma:</label>
          <input
            type="number"
            id="turmaQuestion"
            value={turmaQuestion}
            onChange={(e) => setturmaQuestion(e.target.value)}
          />
        </div>

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

export default Guide;
