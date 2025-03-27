import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";

const HistoricoCoordenadores = () => {
  const [tipoSelecionado, setTipoSelecionado] = useState("");
  const [unidades, setUnidades] = useState([]);
  const [coordenador, setCoordenador] = useState("");
  const [unidadeSelecionada, setUnidadeSelecionada] = useState("");
  const [mesSelecionado, setMesSelecionado] = useState("");
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [carregar, setCarregar] = useState(false);

  const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

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
    },
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

  useEffect(() => {
    const coordenadorNome = localStorage.getItem("coordenadorStorage");
    if (coordenadorNome) {
      setCoordenador(coordenadorNome);
      axios
        .get("https://softwareipmain-production.up.railway.app/unidades")
        .then((response) => {
          const unidadesFiltradas = response.data.filter(
            (unidade) => unidade.coordenador === coordenadorNome
          );
          setUnidades(unidadesFiltradas);
        })
        .catch((error) => console.error("Erro ao buscar unidades:", error));
    }
  }, []);

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
      .get(
        `https://softwareipmain-production.up.railway.app/${tabela}/${unidadeSelecionada}`
      )
      .then((response) => {
        console.log("Avaliações recebidas:", response.data); // <-- AQUI
        setAvaliacoes(response.data);
      })
      .catch((error) => console.error("Erro ao buscar avaliações:", error));
  }, [tipoSelecionado, unidadeSelecionada]);

  const resetarDados = () => {
    setCarregar(false);
    setMesSelecionado("");
  };

  const avaliacoesFiltradas = avaliacoes.filter((avaliacao) => {
    if (!mesSelecionado) return false;
    const data = new Date(avaliacao.date);
    return data.getMonth() === meses.indexOf(mesSelecionado);
  });

  const gerarPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    const titulo = `Histórico de Avaliação Mensal`;
    const subtitulo1 = `Visualizar: ${tipoSelecionado}`;
    const subtitulo2 = `Unidade: ${unidadeSelecionada}`;
    const subtitulo3 = `Mês: ${mesSelecionado}`;

    let y = 20;

    // Cabeçalho
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(titulo, pageWidth / 2, y, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(subtitulo1, pageWidth / 2, (y += 8), { align: "center" });
    doc.text(subtitulo2, pageWidth / 2, (y += 6), { align: "center" });
    doc.text(subtitulo3, pageWidth / 2, (y += 6), { align: "center" });

    // Linha separadora
    y += 4;
    doc.setLineWidth(0.5);
    doc.line(20, y, pageWidth - 20, y);
    y += 6;

    if (avaliacoesFiltradas.length === 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Nenhum dado encontrado para este período.", pageWidth / 2, y, {
        align: "center",
      });
      return doc.save(
        `Relatório_${tipoSelecionado}_${unidadeSelecionada}_${mesSelecionado}.pdf`
      );
    }

    // Início de cada avaliação
    avaliacoesFiltradas.forEach((avaliacao, index) => {
      if (index > 0) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(`Avaliação ${index + 1}`, pageWidth / 2, y, { align: "center" });

      y += 8;

      const formatarDataISO = (iso) => {
        if (!iso || typeof iso !== "string") return "N/A";
        return iso.split("T")[0].split("-").reverse().join("/");
      };

      const info = [
        { label: "Data", valor: formatarDataISO(avaliacao.date) },
        { label: "Nota", valor: avaliacao.nota ?? "N/A" },
        { label: "Regente", valor: avaliacao.regente ?? "N/A" },
      ];

      doc.setFont("helvetica", "normal");
      info.forEach(({ label, valor }) => {
        doc.text(`${label}: ${valor}`, 20, y);
        y += 6;
      });

      // Comentários
      if (avaliacao.comentarios?.trim()) {
        doc.setFont("helvetica", "bold");
        doc.text("Comentários:", 20, y);
        y += 5;

        doc.setFont("helvetica", "normal");
        const comentariosLinhas = doc.splitTextToSize(
          avaliacao.comentarios,
          170
        );
        comentariosLinhas.forEach((linha) => {
          doc.text(linha, 20, y);
          y += 6;
        });

        y += 4;
      }

      // Competências
      const competencias = [
        ["Time Aula", avaliacao.time_aula],
        ["Motivação Alunos", avaliacao.motivacao_alunos],
        ["Oratória Professor", avaliacao.oratoria_professor],
        ["Domínio Tema", avaliacao.dominio_tema],
        [
          "Aplicação Habilidades e Competências",
          avaliacao.aplicacao_habilidades_competencias,
        ],
        ["Construção Pensamento", avaliacao.construcao_pensamento],
        ["Postura Professor", avaliacao.postura_professor],
        [
          "Divisão Tempo Teoria e Prática",
          avaliacao.divisao_tempo_teoria_pratica,
        ],
        ["Criatividade", avaliacao.criatividade],
        ["Motivação Professor", avaliacao.motivacao_professor],
        ["Controle Turma", avaliacao.controle_turma],
        ["Atendimento Alunos", avaliacao.atendimento_alunos],
        ["Metodologia Ativa", avaliacao.metodologia_ativa],
        ["Nível Atividade Proposta", avaliacao.nivel_atividade_proposta],
        ["Conformidade Teachers Guide", avaliacao.conformidade_teachers_guide],
        ["Planejamento Aula", avaliacao.planejamento_aula],
      ].filter(([_, valor]) => valor); // remove os campos vazios

      if (competencias.length > 0) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("Competências Avaliadas:", pageWidth / 2, y, {
          align: "center",
        });
        y += 7;

        competencias.forEach(([titulo, valor]) => {
          if (y + 10 > 270) {
            doc.addPage();
            y = 20;
          }

          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.text(`${titulo}:`, 20, y);

          doc.setFont("helvetica", "normal");

          // Cor de avaliação
          if (valor === "Atendeu") doc.setTextColor(0, 180, 0);
          else if (valor === "Atendeu parcialmente")
            doc.setTextColor(0, 102, 204);
          else if (valor === "Não atendeu") doc.setTextColor(204, 0, 0);
          else doc.setTextColor(0, 0, 0);

          doc.text(`${valor}`, 90, y);
          doc.setTextColor(0, 0, 0);

          y += 6;
        });
      }

      // Rodapé
      doc.setFontSize(9);
      doc.text(
        "software IP Control Gestão - Todos os direitos reservados.",
        pageWidth / 2,
        pageHeight - 10,
        {
          align: "center",
        }
      );
    });

    doc.save(
      `Relatório_${tipoSelecionado}_${unidadeSelecionada}_${mesSelecionado}.pdf`
    );
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

      {/* Terceiro Select - Escolher Mês */}
      {unidadeSelecionada && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Selecione o mês:
          </label>
          <select
            className="mt-1 block w-full p-2 border rounded-md"
            value={mesSelecionado}
            onChange={(e) => setMesSelecionado(e.target.value)}
          >
            <option value="">Selecione...</option>
            {meses.map((mes, index) => (
              <option key={index} value={mes}>
                {mes}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Exibir as avaliações do mês selecionado */}
      {mesSelecionado && avaliacoesFiltradas.length > 0 && (
        <div className="mt-4 p-4 border rounded-md bg-gray-100">
          <h3 className="text-lg font-semibold mb-2">
            Avaliações de {mesSelecionado}
          </h3>
          {avaliacoesFiltradas.map((avaliacao, index) => (
            <div key={index} className="p-2 border-b last:border-0">
              {avaliacao.date && (
                <p>
                  <strong>Data:</strong>{" "}
                  {avaliacao.date.split("T")[0].split("-").reverse().join("/")}
                </p>
              )}

              {avaliacao.regente && (
                <p>
                  <strong>Regente:</strong> {avaliacao.regente}
                </p>
              )}

              {avaliacao.nota !== undefined && avaliacao.nota !== null && (
                <p>
                  <strong>Nota:</strong> {avaliacao.nota}
                </p>
              )}

              {avaliacao.conformidade && (
                <p>
                  <strong>Conformidade:</strong> {avaliacao.conformidade}
                </p>
              )}

              {avaliacao.comentarios?.trim() && (
                <p style={{ marginBottom: "40px" }}>
                  <strong>Comentários:</strong> {avaliacao.comentarios}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-end mb-2">
        <button
          onClick={gerarPDF}
          className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
        >
          Exportar PDF
        </button>
      </div>
    </div>
  );
};

export default HistoricoCoordenadores;
