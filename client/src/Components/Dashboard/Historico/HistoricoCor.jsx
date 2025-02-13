import React, { useState, useEffect } from "react";
import axios from "axios";

const HistoricoCor = () => {
  const [tipoSelecionado, setTipoSelecionado] = useState("");
  const [dados, setDados] = useState([]);
  const [carregar, setCarregar] = useState(false);
  const [mostrarRegistros, setMostrarRegistros] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [datasDisponiveis, setDatasDisponiveis] = useState([]);

  const opcoesHistorico = [
    {
      label: "Planos de Aula",
      tabela: "planoscor",
      colunas: ["coordenador", "nota", "comentarios"],
    },
    {
      label: "Aula",
      tabela: "aulacor",
      colunas: ["nota", "comentarios", "coordenador"],
    },
    {
      label: "Diário",
      tabela: "diarioscor",
      colunas: ["nota", "comentarios", "coordenador"],
    },
    {
      label: "Fotos e Vídeos",
      tabela: "fotosevideoscor",
      colunas: ["coordenador", "nota", "comentarios"],
    },
    {
      label: "Propostas",
      tabela: "propostascor",
      colunas: ["coordenador", "comentarios"],
    },
    {
      label: "Contato",
      tabela: "contatocor",
      colunas: ["retorno", "comentarios", "coordenador"],
    },
    {
      label: "Teachers Guide",
      tabela: "guidecor",
      colunas: ["coordenador", "conformidade", "comentarios"],
    },
    {
      label: "Feira",
      tabela: "feiracor",
      colunas: [
        "coordenador",
        "cronograma",
        "estrutural",
        "apresentacao",
        "comentarios",
      ],
    },
  ];

  const coordenador = localStorage.getItem("coordenadorStorage");

  const handleBuscarDatas = () => {
    if (!tipoSelecionado) return;
    const tabela = opcoesHistorico.find(
      (opcao) => opcao.label === tipoSelecionado
    )?.tabela;
    if (!tabela || !coordenador) return;

    axios
      .get(`http://localhost:3002/${tabela}/${coordenador}`)
      .then((response) => {
        setDados(response.data);
        setDatasDisponiveis(response.data.map((item) => item.date));
        setCarregar(true);
      })
      .catch((error) => console.error("Erro ao buscar dados:", error));
  };

  const handleCarregarDados = () => {
    if (!dataSelecionada) return;
    setMostrarRegistros(true);
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Histórico do Coordenador</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Visualizar:
        </label>
        <select
          className="mt-1 block w-full p-2 border rounded-md"
          value={tipoSelecionado}
          onChange={(e) => {
            setTipoSelecionado(e.target.value);
            setMostrarRegistros(false);
            setDatasDisponiveis([]);
            setDataSelecionada("");
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

      {tipoSelecionado && (
        <div className="mb-4">
          <button
            onClick={handleBuscarDatas}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
          >
            Buscar Datas Disponíveis
          </button>
        </div>
      )}

      {carregar && datasDisponiveis.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Selecione a Data:
          </label>
          <select
            className="mt-1 block w-full p-2 border rounded-md"
            value={dataSelecionada}
            onChange={(e) => setDataSelecionada(e.target.value)}
          >
            <option value="">Selecione...</option>
            {datasDisponiveis.map((data, index) => (
              <option key={index} value={data}>
                {new Date(data).toLocaleDateString("pt-BR")}
              </option>
            ))}
          </select>
        </div>
      )}

      {dataSelecionada && (
        <div className="mb-4">
          <button
            onClick={handleCarregarDados}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
          >
            Carregar Registro Selecionado
          </button>
        </div>
      )}

      {mostrarRegistros && (
        <div className="mt-4 p-4 border rounded-md bg-gray-100">
          <h3 className="text-lg font-semibold mb-2">Detalhes do Registro</h3>
          {dados
            .filter((item) => item.date === dataSelecionada)
            .map((item, index) => (
              <div key={index} className="mb-2 p-2 border-b">
                {opcoesHistorico
                  .find((opcao) => opcao.label === tipoSelecionado)
                  ?.colunas.map((coluna) => (
                    <p key={coluna}>
                      <strong>
                        {coluna.charAt(0).toUpperCase() + coluna.slice(1)}:
                      </strong>{" "}
                      {item[coluna] ?? "N/A"}
                    </p>
                  ))}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default HistoricoCor;
