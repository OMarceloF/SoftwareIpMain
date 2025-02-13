import React, { useState, useEffect } from "react";
import axios from "axios";

const Historico = () => {
  const [tipoSelecionado, setTipoSelecionado] = useState("");
  const [unidades, setUnidades] = useState([]);
  const [coordenador, setCoordenador] = useState("");
  const [unidadeSelecionada, setUnidadeSelecionada] = useState("");
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [avaliacaoSelecionada, setAvaliacaoSelecionada] = useState("");
  const [dadosSelecionados, setDadosSelecionados] = useState(null);
  const [carregar, setCarregar] = useState(false);

  const opcoesHistorico = [
    {
      label: "Planos de Aula",
      tabela: "planos",
      colunas: ["regente", "nota", "comentarios"],
    },
    {
      label: "Aula",
      tabela: "aula",
      colunas: ["regente", "nota", "comentarios"],
    },
    {
      label: "Diário",
      tabela: "diarios",
      colunas: ["regente", "nota", "comentarios"],
    }, // 🔹 Adicionando a lógica para buscar detalhes corretamente
    {
      label: "Fotos e Vídeos",
      tabela: "fotosevideos",
      colunas: ["nota", "comentarios"],
    },
    {
      label: "Propostas",
      tabela: "propostas",
      colunas: ["regente", "comentarios"],
    },
    {
      label: "Inventário",
      tabela: "inventario",
      colunas: ["regente", "comentarios", "quem", "resolvido"],
    },
    {
      label: "Contato",
      tabela: "contato",
      colunas: ["retorno", "comentarios"],
    },
    {
      label: "Teachers Guide",
      tabela: "guide",
      colunas: ["turma", "conformidade", "comentarios"],
    },
    {
      label: "Feira",
      tabela: "feira",
      colunas: ["cronograma", "estrutural", "apresentacao", "comentarios"],
    },
  ];

  const email = localStorage.getItem("emailStorage");

  useEffect(() => {
    if (!email) return;

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

  useEffect(() => {
    if (!tipoSelecionado || !unidadeSelecionada) {
      setAvaliacoes([]);
      return;
    }

    const tabela = opcoesHistorico.find(
      (opcao) => opcao.label === tipoSelecionado
    )?.tabela;
    if (!tabela) return;

    axios
      .get(`https://softwareipmain-production.up.railway.app/${tabela}/${unidadeSelecionada}`)
      .then((response) => {
        const datasOrdenadas = response.data
          .map((item) => item.date)
          .sort((a, b) => new Date(a) - new Date(b));

        setAvaliacoes(datasOrdenadas);
      })
      .catch((error) => console.error("Erro ao buscar avaliações:", error));
  }, [tipoSelecionado, unidadeSelecionada]);

  const handleCarregarDados = () => {
    if (!tipoSelecionado || !unidadeSelecionada || !avaliacaoSelecionada) {
      setDadosSelecionados(null);
      return;
    }

    const tabela = opcoesHistorico.find(
      (opcao) => opcao.label === tipoSelecionado
    )?.tabela;
    if (!tabela) return;

    // 🔹 Ajuste para `Diário` e `Aula` usarem uma rota específica
    const rota =
      tabela === "aula" ||
      tabela === "diarios" ||
      tabela === "planos" ||
      tabela === "inventario" ||
      tabela === "fotosevideos" ||
      tabela === "propostas" ||
      tabela === "contato" ||
      tabela === "guide" ||
      tabela === "feira"
        ? `/${tabela}/detalhes/${unidadeSelecionada}`
        : `/${tabela}/${unidadeSelecionada}`;

    axios
      .get(`https://softwareipmain-production.up.railway.app${rota}`)
      .then((response) => {
        const linhaSelecionada = response.data.find(
          (item) => item.date === avaliacaoSelecionada
        );
        console.log("Linha selecionada do backend:", linhaSelecionada);
        setDadosSelecionados(linhaSelecionada);
        setCarregar(true);
      })
      .catch((error) =>
        console.error("Erro ao buscar dados da avaliação:", error)
      );
  };

  const resetarDados = () => {
    setCarregar(false);
    setDadosSelecionados(null);
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Histórico</h2>

      {/* Primeiro Select - Escolher Tipo de Histórico */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Visualizar:
        </label>
        <select
          className="mt-1 block w-full p-2 border rounded-md"
          value={tipoSelecionado}
          onChange={(e) => {
            setTipoSelecionado(e.target.value);
            resetarDados();
          }}
        >
          <option value="">Selecione...</option>
          {opcoesHistorico.map((opcao) => (
            <option key={opcao.tabela} value={opcao.label}>
              {opcao.label}
            </option>
          ))}
        </select>
      </div>

      {/* Segundo Select - Lista de Unidades do Coordenador Logado */}
      {tipoSelecionado && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Selecione a unidade:
          </label>
          <select
            className="mt-1 block w-full p-2 border rounded-md"
            value={unidadeSelecionada}
            onChange={(e) => {
              setUnidadeSelecionada(e.target.value);
              resetarDados();
            }}
          >
            <option value="">Selecione...</option>
            {unidades.map((unidade) => (
              <option key={unidade.cidade} value={unidade.cidade}>
                {unidade.cidade}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Terceiro Select - Listar as datas disponíveis */}
      {unidadeSelecionada && avaliacoes.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Avaliação:
          </label>
          <select
            className="mt-1 block w-full p-2 border rounded-md"
            value={avaliacaoSelecionada}
            onChange={(e) => {
              setAvaliacaoSelecionada(e.target.value);
              resetarDados();
            }}
          >
            <option value="">Selecione...</option>
            {avaliacoes.map((data, index) => (
              <option key={index} value={data}>
                {new Date(data).toLocaleDateString("pt-BR")}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Botão para carregar os dados */}
      {avaliacaoSelecionada && (
        <div className="mb-4">
          <button
            onClick={handleCarregarDados}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
          >
            Carregar
          </button>
        </div>
      )}

      {/* Exibir os dados carregados */}
      {carregar && dadosSelecionados && (
        <div className="mt-4 p-4 border rounded-md bg-gray-100">
          <h3 className="text-lg font-semibold mb-2">Detalhes da Avaliação</h3>
          {opcoesHistorico
            .find((opcao) => opcao.label === tipoSelecionado)
            ?.colunas.map((coluna) => (
              <p key={coluna}>
                <strong>
                  {coluna.charAt(0).toUpperCase() + coluna.slice(1)}:
                </strong>{" "}
                {coluna === "date" && dadosSelecionados[coluna]
                  ? (() => {
                      const data = new Date(dadosSelecionados[coluna]);
                      const dia = String(data.getUTCDate()).padStart(2, "0");
                      const mes = String(data.getUTCMonth() + 1).padStart(
                        2,
                        "0"
                      );
                      const ano = data.getUTCFullYear();
                      return `${dia}/${mes}/${ano}`;
                    })()
                  : coluna === "nota"
                  ? dadosSelecionados[coluna] // Exibe normalmente se for nota
                  : typeof dadosSelecionados[coluna] === "number"
                  ? dadosSelecionados[coluna] === 0
                    ? "Sim"
                    : "Não"
                  : dadosSelecionados[coluna] ?? ""}
              </p>
            ))}
        </div>
      )}
    </div>
  );
};

export default Historico;
