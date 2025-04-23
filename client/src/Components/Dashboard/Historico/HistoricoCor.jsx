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
    // Assume data no formato YYYY-MM-DD
    const [ano, mes, dia] = dataISO.split("T")[0].split("-");
    const data = new Date(Number(ano), Number(mes) - 1, Number(dia)); // Mês começa do 0
    return data.toLocaleDateString("pt-BR");
  };


    const gerarPDF = () => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const titulo = `Relatório - ${tipoSelecionado}`;
    const dataFormatada = formatarData(dataSelecionada);
  
    const colunas = opcoesHistorico.find(
      (opcao) => opcao.label === tipoSelecionado
    )?.colunas;
  
    const registrosFiltrados = dados.filter(
      (item) => item.date === dataSelecionada
    );
  
    let y = 20;
  
    doc.setFontSize(16);
    doc.text(titulo, 14, y);
    y += 10;
    doc.setFontSize(12);
    doc.text(`Data: ${dataFormatada}`, 14, y);
    y += 10;
  
    registrosFiltrados.forEach((registro, index) => {
      const alturaMinimaParaRegistro = 10 + colunas.length * 8;
  
      // Verifica se ainda há espaço na página, se não, cria nova
      if (y + alturaMinimaParaRegistro > pageHeight - 20) {
        doc.addPage();
        y = 20;
      }
  
      doc.setFontSize(14);
      doc.text(`Registro ${index + 1}`, 14, y);
      y += 8;
  
      colunas.forEach((coluna) => {
        const label = formatarLabel(coluna);
        const valor = registro[coluna] ?? "N/A";
        const texto = `${label}: ${valor}`;
  
        const linhas = doc.splitTextToSize(texto, 180);
        linhas.forEach((linha) => {
          if (y + 6 > pageHeight - 20) {
            doc.addPage();
            y = 20;
          }
          doc.setFontSize(11);
          doc.text(linha, 14, y);
          y += 6;
        });
      });
  
      y += 8;
  
      // Se o próximo registro não couber, nova página
      if (y + alturaMinimaParaRegistro > pageHeight - 20) {
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
        "unidade",
        "nota",
        "coordenador",
        "comentarios",
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
      .get(
        `https://softwareipmain-production.up.railway.app/${tabela}/${coordenador}`
        //`http://localhost:3002/${tabela}/${coordenador}`
      )
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
    return coluna.replaceAll("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

   return (
    <div className="p-4 max-w-4xl mx-auto" id="conteudo-pdf">
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
                {formatarData(data)}
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
    <h3 className="text-lg font-semibold mb-4">Detalhes do Registro</h3>
    {dados
      .filter((item) => item.date === dataSelecionada)
      .map((item, index) => (
        <div key={index} className="mb-10">
          <div className="p-6 bg-white rounded-lg shadow-md border-2 border-gray-300 space-y-6">
            {/* Título da Unidade */}
            {item.unidade && (
              <h4
    className="text-xl font-semibold text-blue-700 mb-4 border-b pb-2"
    style={{ marginTop: '80px' }}
  >
    Unidade: {item.unidade}
  </h4>           
            )}

            {/* Detalhes */}
            {opcoesHistorico
              .find((opcao) => opcao.label === tipoSelecionado)
              ?.colunas.map((coluna) => (
                <div
                  key={coluna}
                  className="flex justify-between border-b pb-2 last:border-b-0 leading-loose"
                >
                  <strong className="text-gray-700">{formatarLabel(coluna)}:</strong>
                  <span className="text-gray-900">{item[coluna] ?? "N/A"}</span>
                </div>
              ))}
          </div>
        </div>
      ))}
  </div>
)}
    </div>
  );
   
};

export default HistoricoCor;
