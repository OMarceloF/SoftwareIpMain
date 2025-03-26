import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";

const HistoricoCor = () => {
  const [tipoSelecionado, setTipoSelecionado] = useState("");
  const [dados, setDados] = useState([]);
  const [carregar, setCarregar] = useState(false);
  const [mostrarRegistros, setMostrarRegistros] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [datasDisponiveis, setDatasDisponiveis] = useState([]);

  const formatarData = (dataISO) => {
    const data = new Date(dataISO);
    data.setMinutes(data.getMinutes() + data.getTimezoneOffset());
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(data);
  };

  const gerarPDF = () => {
    const doc = new jsPDF();
    const titulo = `Relatório - ${tipoSelecionado}`;
    const dataFormatada = new Date(dataSelecionada).toLocaleDateString("pt-BR");
  
    const colunas = opcoesHistorico.find(
      (opcao) => opcao.label === tipoSelecionado
    )?.colunas;
  
    const registrosFiltrados = dados.filter((item) => item.date === dataSelecionada);
  
    let y = 20; // Posição vertical inicial
  
    doc.setFontSize(16);
    doc.text(titulo, 14, y);
    y += 10;
    doc.setFontSize(12);
    doc.text(`Data: ${dataFormatada}`, 14, y);
    y += 10;
  
    registrosFiltrados.forEach((registro, index) => {
      doc.setFontSize(14);
      doc.text(`Registro ${index + 1}`, 14, y);
      y += 8;
  
      colunas.forEach((coluna) => {
        const label = formatarLabel(coluna);
        const valor = registro[coluna] ?? "N/A";
  
        const texto = `${label}: ${valor}`;
  
        // Se o texto estiver muito longo, quebre em várias linhas
        const linhas = doc.splitTextToSize(texto, 180);
        linhas.forEach((linha) => {
          doc.setFontSize(11);
          doc.text(linha, 14, y);
          y += 6;
        });
      });
  
      y += 8;
  
      // Se ultrapassar o tamanho da página, cria nova página
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });
  
    doc.save(`${titulo}-${dataFormatada}.pdf`);
  };
  
  const opcoesHistorico = [
    {
      label: "Planos de Aula",
      tabela: "planoscor",
      colunas: ["coordenador", "nota", "comentarios"],
    },
    {
      label: "Aula",
      tabela: "aulacor",
      colunas: [
        "unidade", "nota", "coordenador", "comentarios",
        "conformidade_teachers_guide", "planejamento_aula", "oratoria_professor",
        "dominio_tema", "aplicacao_habilidades_competencias", "construcao_pensamento",
        "postura_professor", "divisao_tempo_teoria_pratica", "criatividade", "motivacao_professor",
        "controle_turma", "atendimento_alunos", "metodologia_ativa", "nivel_atividade_proposta",
        "time_aula", "motivacao_alunos"
      ],
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
      .get(`https://softwareipmain-production.up.railway.app/${tabela}/${coordenador}`)
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

  const formatarLabel = (coluna) => {
    return coluna
      .replaceAll("_", " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  
  return (
    <div className="p-4 max-w-4xl mx-auto">
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
        <div className="mb-4 flex gap-2">
          <button
            onClick={handleCarregarDados}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
          >
            Carregar Registro Selecionado
          </button>
          <button
            onClick={gerarPDF}
            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
          >
            Exportar PDF
          </button>
        </div>
      )}


      {mostrarRegistros && (
        <div className="mt-4 p-4 border rounded-md bg-gray-100">
          <h3 className="text-lg font-semibold mb-2">Detalhes do Registro</h3>
          {dados
            .filter((item) => item.date === dataSelecionada)
            .map((item, index) => (
              <div key={index} className="mb-6 p-4 border-b bg-white rounded-md shadow-sm">
                {opcoesHistorico
                  .find((opcao) => opcao.label === tipoSelecionado)
                  ?.colunas.map((coluna) => (
                    <div
                      key={coluna}
                      className="flex justify-between py-1 border-b last:border-b-0"
                    >
                      <strong>{formatarLabel(coluna)}:</strong>
                      <span>{item[coluna] ?? "N/A"}</span>
                    </div>
                  ))}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default HistoricoCor;
