import React, { useState, useEffect } from "react";
import "../../../../App.css";
import "./Aulas.css";
import axios from "axios";

const Aulas = () => {
  // Estados principais
  const [unit, setUnit] = useState("");
  const [rating, setRating] = useState(0);
  const [textQuestion1, setTextQuestion1] = useState("");
  const [textQuestion2, setTextQuestion2] = useState("");
  const [unidades, setUnidades] = useState([]);
  const [coordenador, setCoordenador] = useState("");

  // Rótulos corrigidos para exibição visual
const labelsCompetencias = {
  conformidade_teachers_guide: "Conformidade com o Teacher's Guide",
  planejamento_aula: "Planejamento da aula",
  oratoria_professor: "Oratória do professor",
  dominio_tema: "Domínio do tema",
  aplicacao_habilidades_competencias: "Aplicação de habilidades e competências",
  construcao_pensamento: "Construção do pensamento",
  postura_professor: "Postura do professor",
  divisao_tempo_teoria_pratica: "Divisão de tempo entre teoria e prática",
  criatividade: "Criatividade",
  motivacao_professor: "Motivação do professor",
  controle_turma: "Controle da turma",
  atendimento_alunos: "Atendimento aos alunos",
  metodologia_ativa: "Uso de metodologia ativa",
  nivel_atividade_proposta: "Nível da atividade proposta",
  time_aula: "Gerenciamento do tempo de aula",
  motivacao_alunos: "Motivação dos alunos",
};

  // Lista de competências avaliadas
  const [competencias, setCompetencias] = useState([
    "conformidade_teachers_guide",
    "planejamento_aula",
    "oratoria_professor",
    "dominio_tema",
    "aplicacao_habilidades_competencias",
    "construcao_pensamento",
    "postura_professor",
    "divisao_tempo_teoria_pratica",
    "criatividade",
    "motivacao_professor",
    "controle_turma",
    "atendimento_alunos",
    "metodologia_ativa",
    "nivel_atividade_proposta",
    "time_aula",
    "motivacao_alunos",
  ]);

  // Respostas por competência
  const [respostasCompetencias, setRespostasCompetencias] = useState({});

  // Mensagens globais
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Erros por campo específico
  const [fieldErrors, setFieldErrors] = useState({});

  const email = localStorage.getItem("emailStorage");

  // Busca nome do coordenador e as unidades associadas
  useEffect(() => {
    if (!email) {
      setErrorMessage("Usuário não autenticado.");
      return;
    }

    axios
      .get(`https://softwareipmain-production.up.railway.app/getUsername/${email}`)
      .then((response) => {
        const nomeCoordenador = response.data.name;
        setCoordenador(nomeCoordenador);

        axios
          .get("https://softwareipmain-production.up.railway.app/unidades")
          .then((response) => {
            const unidadesFiltradas = response.data.filter(
              (unidade) => unidade.coordenador === nomeCoordenador
            );
            setUnidades(unidadesFiltradas);
          })
          .catch((error) => console.error("Erro ao buscar unidades:", error));
      })
      .catch((error) => console.error("Erro ao obter coordenador:", error));
  }, [email]);

  // Atualiza resposta para uma competência
  const handleCompetenciaChange = (competencia, valor) => {
    setRespostasCompetencias((prev) => ({ ...prev, [competencia]: valor }));
  };

  // Validação e envio do formulário
  const handleSubmit = (event) => {
    event.preventDefault();
    const currentDate = new Date().toISOString().split("T")[0];
    const newErrors = {};

    // Verifica campos obrigatórios
    if (!unit) newErrors.unit = "Unidade obrigatória";
    if (!textQuestion1) newErrors.textQuestion1 = "Regente obrigatório";
    if (rating === 0) newErrors.rating = "Selecione uma nota";
    if (!textQuestion2) newErrors.textQuestion2 = "Comentário obrigatório";

    // Verifica se todas as competências foram avaliadas
    const competenciasNaoPreenchidas = competencias.filter(
      (comp) => !respostasCompetencias[comp]
    );

    if (competenciasNaoPreenchidas.length > 0) {
      competenciasNaoPreenchidas.forEach((comp) => {
        newErrors[comp] = "Obrigatório";
      });
    }

    // Se houver erros, exibe e não envia
    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      setErrorMessage("Por favor, preencha todos os campos obrigatórios.");
      setTimeout(() => {
        setErrorMessage("");
        setFieldErrors({});
      }, 4000);
      return;
    }

    setFieldErrors({});
    setErrorMessage("");

    const competenciasFormatadas = {};
    competencias.forEach((competencia) => {
      const valorSelecionado = respostasCompetencias[competencia];
      competenciasFormatadas[competencia] = valorSelecionado || "Não Atendeu";
    });

    const formData = {
      date: currentDate,
      unidade: unit,
      regente: textQuestion1,
      nota: rating,
      comentarios: textQuestion2,
      ...competenciasFormatadas,
    };

    axios
      .post("https://softwareipmain-production.up.railway.app/aula", formData)
      .then(() => {
        setSuccessMessage("Dados enviados com sucesso!");
        setUnit("");
        setRating(0);
        setTextQuestion1("");
        setTextQuestion2("");
        setRespostasCompetencias({});

        setTimeout(() => setSuccessMessage(""), 4000);
      })
      .catch((error) => console.error("Erro ao enviar dados:", error));
  };

  return (
    <>
      <div className="title-form">
        <h2>Avaliação de Aulas Assistidas</h2>
      </div>

      {/* Notificações flutuantes */}
      {errorMessage && (
        <div className="floating-alert error-alert">{errorMessage}</div>
      )}
      {successMessage && (
        <div className="floating-alert success-alert">{successMessage}</div>
      )}


      <form onSubmit={handleSubmit}>
        {/* Unidade */}
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
          {fieldErrors.unit && <p className="error-text">{fieldErrors.unit}</p>}
        </div>

        {/* Regente */}
        <div>
          <label htmlFor="textQuestion1">Regente</label>
          <input
            type="text"
            id="textQuestion1"
            value={textQuestion1}
            onChange={(e) => setTextQuestion1(e.target.value)}
          />
          {fieldErrors.textQuestion1 && (
            <p className="error-text">{fieldErrors.textQuestion1}</p>
          )}
        </div>

        {/* Competências */}
        <div>
          <h3>Avaliação das Competências</h3>
          {competencias.map((competencia, index) => (
            <div key={index} className="competencia-row">
              <span>{labelsCompetencias[competencia] || competencia}</span> 
              <div className="competencia-options">
                {["Atendeu", "Atendeu Parcialmente", "Não Atendeu"].map(
                  (opcao) => (  
                    <label key={opcao}>
                      <input
                        type="radio"
                        name={competencia}
                        value={opcao}
                        checked={respostasCompetencias[competencia] === opcao}
                        onChange={(e) =>
                          handleCompetenciaChange(
                            competencia,
                            e.target.value
                          )
                        }
                      />
                      {opcao}
                    </label>
                  )
                )}
              </div>
              {fieldErrors[competencia] && (
                <p className="error-text">{fieldErrors[competencia]}</p>
              )}
            </div>
          ))}
        </div>

        {/* Nota */}
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
          {fieldErrors.rating && (
            <p className="error-text">{fieldErrors.rating}</p>
          )}
        </div>

        {/* Comentários */}
        <div>
          <label htmlFor="textQuestion2">Comentários</label>
          <textarea
            id="textQuestion2"
            placeholder="Fale mais"
            value={textQuestion2}
            onChange={(e) => setTextQuestion2(e.target.value)}
          ></textarea>
          {fieldErrors.textQuestion2 && (
            <p className="error-text">{fieldErrors.textQuestion2}</p>
          )}
        </div>

        <button type="submit">Enviar</button>
      </form>
    </>
  );
};

export default Aulas;
