import React, { useState, useEffect } from "react";
import "../../../../App.css";
import "./Planos.css";
import axios from "axios";

const Planos = () => {
  const [unit, setUnit] = useState("");
  const [rating, setRating] = useState(0);
  const [textQuestion1, setTextQuestion1] = useState("");
  const [textQuestion2, setTextQuestion2] = useState("");
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

    if (!unit || !textQuestion1 || !textQuestion2 || rating === null) {
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
      regente: textQuestion1,
      nota: rating,
      comentarios: textQuestion2,
    };

    axios
      .post("https://softwareipmain-production.up.railway.app/planos", formData)
      .then(() => {
        setSuccessMessage("Dados enviados com sucesso!");
        setUnit("");
        setRating(0);
        setTextQuestion1("");
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
      <h2>Avaliação de Planos de Aulas</h2>
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
          <label htmlFor="textQuestion1">Regente:</label>
          <input
            type="text"
            id="textQuestion1"
            value={textQuestion1}
            onChange={(e) => setTextQuestion1(e.target.value)}
          />
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

export default Planos;
