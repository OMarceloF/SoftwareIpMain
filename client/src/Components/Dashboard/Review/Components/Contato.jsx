import React, { useState, useEffect } from "react";
import "../../../../App.css";
import "./Contato.css";
import axios from "axios";

const Contato = () => {
  const [unit, setUnit] = useState("");
  const [textQuestion2, setTextQuestion2] = useState("");
  const [yesNoQuestion, setYesNoQuestion] = useState("");
  const [unidades, setUnidades] = useState([]);
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
      )
      .then((response) => {
        const nomeCoordenador = response.data.name;
        setCoordenador(nomeCoordenador);

        // Buscar as unidades e filtrar apenas as que pertencem ao coordenador logado
        axios
          .get("https://softwareipmain-production.up.railway.app/unidades")
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

    if (!unit || !yesNoQuestion || !textQuestion2) {
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
      retorno: yesNoQuestion,
      comentarios: textQuestion2,
    };

    axios
      .post(
        "https://softwareipmain-production.up.railway.app/contato",
        formData
      )
      .then(() => {
        setSuccessMessage("Dados enviados com sucesso!");
        setUnit("");
        setYesNoQuestion("");
        setTextQuestion2("");

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

export default Contato;
