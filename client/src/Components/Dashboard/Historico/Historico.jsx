import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Historico = () => {
  const [tipoSelecionado, setTipoSelecionado] = useState("");
  const [unidades, setUnidades] = useState([]);
  const [coordenador, setCoordenador] = useState("");
  const [unidadeSelecionada, setUnidadeSelecionada] = useState("");
  const [mesSelecionado, setMesSelecionado] = useState("");
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [carregar, setCarregar] = useState(false);
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
    const [respostasCompetencias, setRespostasCompetencias] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const opcoesHistorico = [
    { label: "Planos de Aula", tabela: "planos", colunas: ["regente", "nota", "comentarios"] },
    { label: "Aula", tabela: "aula", colunas: ["regente", "nota", "comentarios"] },
    { label: "Diário", tabela: "diarios", colunas: ["regente", "nota", "comentarios"] },
    { label: "Fotos e Vídeos", tabela: "fotosevideos", colunas: ["nota", "comentarios"] },
    { label: "Propostas", tabela: "propostas", colunas: ["regente", "comentarios"] },
    { label: "Inventário", tabela: "inventario", colunas: ["regente", "comentarios", "quem", "resolvido"] },
    { label: "Contato", tabela: "contato", colunas: ["retorno", "comentarios"] },
    { label: "Teachers Guide", tabela: "guide", colunas: ["turma", "conformidade", "comentarios"] },
    { label: "Feira", tabela: "feira", colunas: ["cronograma", "estrutural", "apresentacao", "comentarios"] },
  ];

  const email = localStorage.getItem("emailStorage");

  useEffect(() => {
    if (!email) return;

    axios.get(`https://softwareipmain-production.up.railway.app/getUsername/${email}`)
    //axios.get(`http://localhost:3002/getUsername/${email}`)
      .then(response => {
        const nomeCoordenador = response.data.name;
        setCoordenador(nomeCoordenador);

        axios.get("https://softwareipmain-production.up.railway.app/unidades")
        //axios.get("http://localhost:3002/unidades")
          .then(response => {
            const unidadesFiltradas = response.data.filter(
              unidade => unidade.coordenador === nomeCoordenador
            );
            setUnidades(unidadesFiltradas);
          })
          .catch(error => console.error("Erro ao buscar unidades:", error));
      })
      .catch(error => console.error("Erro ao obter coordenador:", error));
  }, [email]);

  useEffect(() => {
    if (!tipoSelecionado || !unidadeSelecionada) {
      setAvaliacoes([]);
      return;
    }
  
    const tabela = opcoesHistorico.find(opcao => opcao.label === tipoSelecionado)?.tabela;
    if (!tabela) return;
  
    axios.get(`https://softwareipmain-production.up.railway.app/${tabela}/${unidadeSelecionada}`)
    //axios.get(`http://localhost:3002/${tabela}/${unidadeSelecionada}`)
      .then(response => {
        console.log("🚀 Dados recebidos da API:", response.data); // VERIFICAR SE `competencias` ESTÁ CHEGANDO!
        setAvaliacoes(response.data);
      })
      .catch(error => console.error("❌ Erro ao buscar avaliações:", error));
  }, [tipoSelecionado, unidadeSelecionada]);
  

  const resetarDados = () => {
    setCarregar(false);
    setMesSelecionado("");
  };

  const formatarData = (dataISO) => {
    const data = new Date(dataISO);
    data.setMinutes(data.getMinutes() + data.getTimezoneOffset());
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(data);
  };

  const avaliacoesFiltradas = avaliacoes.filter(avaliacao => {
    if (!mesSelecionado) return false;
    const data = new Date(avaliacao.date);
    data.setMinutes(data.getMinutes() + data.getTimezoneOffset()); // Corrige UTC
    return data.getMonth() === meses.indexOf(mesSelecionado);
}); avaliacoes.map(avaliacao => ({
    ...avaliacao,
    competencias: typeof avaliacao.competencias === "string" 
        ? JSON.parse(avaliacao.competencias || "{}") 
        : avaliacao.competencias || {}
}));


const gerarPDF = () => {
  const doc = new jsPDF("p", "mm", "a4");

  const pageWidth = doc.internal.pageSize.width; // Largura total da página

  // ** Cabeçalho reduzido e centralizado **
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Histórico de Avaliação Mensal", pageWidth / 2, 12, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Visualizar: ${tipoSelecionado}`, pageWidth / 2, 18, { align: "center" });
  doc.text(`Unidade: ${unidadeSelecionada}`, pageWidth / 2, 24, { align: "center" });
  doc.text(`Mês: ${mesSelecionado}`, pageWidth / 2, 30, { align: "center" });

  // ** Linha Separadora **
  doc.setLineWidth(0.5);
  doc.line(20, 34, pageWidth - 20, 34);

  let y = 40; // Posição inicial

  if (avaliacoesFiltradas.length === 0) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Nenhum dado encontrado para este período.", pageWidth / 2, y, { align: "center" });
  } else {
    avaliacoesFiltradas.forEach((avaliacao, index) => {
      // ** Inicia uma nova página para cada avaliação **
      if (index > 0) {
        doc.addPage();
        y = 20;
      }

      let comentario = avaliacao.comentarios || "";
      let linhasComentario = doc.splitTextToSize(comentario, 140); // Limitando largura do comentário centralizado
      let alturaComentario = linhasComentario.length * 5;

      // ** Verifica se cabe o comentário + competências na mesma página **
      let alturaTotal = 50 + alturaComentario + (avaliacao.competencias ? 120 : 0);
      let precisaDeNovaPagina = y + alturaTotal > 270;

      // ** Se precisar, adiciona uma nova página **
      if (precisaDeNovaPagina) {
        doc.addPage();
        y = 20;
      }

      // ** Texto da Avaliação (Centralizado) **
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(`Data: ${formatarData(avaliacao.date)}`, pageWidth / 2, y, { align: "center" });

      doc.setFont("helvetica", "bold");
      doc.text(`Nota: ${avaliacao.nota}`, pageWidth / 2, y + 7, { align: "center" });

      doc.setFont("helvetica", "bold");
      doc.text(`Regente: ${avaliacao.regente}`, pageWidth / 2, y + 14, { align: "center" });

      doc.setFont("helvetica", "bold");
      doc.text("Comentários:", pageWidth / 2, y + 21, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.text(linhasComentario, pageWidth / 2 - 70, y + 28, { align: "left" });

      y += 40 + alturaComentario; // Avança a posição corretamente

      // ** Renderiza as competências na mesma página SE houver espaço **
      if (!precisaDeNovaPagina) {
        y += 10;
      } else {
        doc.addPage();
        y = 20;
      }

      // ** Definição das competências **
      let competencias = [
        ["Time Aula", avaliacao.time_aula || "Não informado"],
        ["Motivação Alunos", avaliacao.motivacao_alunos || "Não informado"],
        ["Oratória Professor", avaliacao.oratoria_professor || "Não informado"],
        ["Domínio Tema", avaliacao.dominio_tema || "Não informado"],
        ["Aplicação Habilidades e Competências", avaliacao.aplicacao_habilidades_competencias || "Não informado"],
        ["Construção Pensamento", avaliacao.construcao_pensamento || "Não informado"],
        ["Postura Professor", avaliacao.postura_professor || "Não informado"],
        ["Divisão Tempo Teoria e Prática", avaliacao.divisao_tempo_teoria_pratica || "Não informado"],
        ["Criatividade", avaliacao.criatividade || "Não informado"],
        ["Motivação Professor", avaliacao.motivacao_professor || "Não informado"],
        ["Controle Turma", avaliacao.controle_turma || "Não informado"],
        ["Atendimento Alunos", avaliacao.atendimento_alunos || "Não informado"],
        ["Metodologia Ativa", avaliacao.metodologia_ativa || "Não informado"],
        ["Nível Atividade Proposta", avaliacao.nivel_atividade_proposta || "Não informado"]
      ];

      // ** Estilizando o título das competências **
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Competências Avaliadas:", pageWidth / 2, y, { align: "center" });
      doc.setFont("helvetica", "normal");
      y += 7;

      // ** Renderizando as competências centralizadas **
      competencias.forEach(([titulo, valor]) => {
        if (y + 10 > 270) { // Se estiver perto do final da página, cria uma nova
          doc.addPage();
          y = 20;
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text(`${titulo}:`, pageWidth / 2 - 30, y, { align: "right" });

        // ** Aplicando cor de acordo com o valor **
        if (valor === "Atendeu") {
          doc.setTextColor(0, 255, 0); // 🟢 Verde Neon
        } else if (valor === "Atendeu parcialmente") {
          doc.setTextColor(0, 200, 255); // 🔵 Azul Neon
        } else if (valor === "Não atendeu") {
          doc.setTextColor(255, 0, 0); // 🔴 Vermelho Neon
        } else {
          doc.setTextColor(0, 0, 0); // Cor padrão (Preto)
        }

        doc.setFont("helvetica", "normal");
        doc.text(valor, pageWidth / 2 + 30, y, { align: "left" }); // Exibir resposta ao lado direito

        doc.setTextColor(0, 0, 0); // Resetando cor para o próximo texto

        y += 8; // Ajusta espaçamento entre as linhas
      });

      // ** Rodapé na mesma página das competências **
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(10);
      doc.text(
        "software IP Control Gestão - Todos os direitos reservados.",
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );

      // ** PULAR PARA NOVA PÁGINA ANTES DA PRÓXIMA AVALIAÇÃO **
      doc.addPage();
      y = 20;
    });
  }

  // ** Salvar o PDF com um nome dinâmico **
  doc.save(`Relatorio_${tipoSelecionado}_${unidadeSelecionada}_${mesSelecionado}.pdf`);
};

const estiloDiv = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-between",
  gap: "15px",
  padding: "20px",
  borderBottom: "1px solid #ddd"
};
  
  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Histórico</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Visualizar:</label>
        <select className="mt-1 block w-full p-2 border rounded-md"
          value={tipoSelecionado}
          onChange={(e) => {
            setTipoSelecionado(e.target.value);
            resetarDados();
          }}>
          <option value="">Selecione...</option>
          {opcoesHistorico.map(opcao => (
            <option key={opcao.tabela} value={opcao.label}>{opcao.label}</option>
          ))}
        </select>
      </div>

      {tipoSelecionado && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Selecione a unidade:</label>
          <select className="mt-1 block w-full p-2 border rounded-md"
            value={unidadeSelecionada}
            onChange={(e) => {
              setUnidadeSelecionada(e.target.value);
              resetarDados();
            }}>
            <option value="">Selecione...</option>
            {unidades.map(unidade => (
              <option key={unidade.cidade} value={unidade.cidade}>{unidade.cidade}</option>
            ))}
          </select>
        </div>
      )}

      {unidadeSelecionada && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Selecione o mês:</label>
          <select className="mt-1 block w-full p-2 border rounded-md"
            value={mesSelecionado}
            onChange={(e) => setMesSelecionado(e.target.value)}>
            <option value="">Selecione...</option>
            {meses.map((mes, index) => (
              <option key={index} value={mes}>{mes}</option>
            ))}
          </select>
        </div>
      )}

      {mesSelecionado && (
        <div id="relatorio-pdf" className="mt-4 p-4 border rounded-md bg-gray-100">
          <h3 className="text-lg font-semibold mb-2">Relatório de {mesSelecionado}</h3>
          {avaliacoesFiltradas.map((avaliacao, index) => (
            <div key={index} className="p-2 border-b last:border-0">
              <p style={{ marginTop: "150px" }}><strong>Data:</strong> {formatarData(avaliacao.date)}</p>
              {avaliacao.regente && (<p><strong>Regente:</strong> {avaliacao.regente}</p>)}
              {avaliacao.nota && (<p style={{ marginBottom: "30px" }}><strong>Nota:</strong> {avaliacao.nota}</p>)}
              {avaliacao.conformidade && (<p style={{ marginBottom: "30px" }}><strong>Conformidade:</strong> {avaliacao.conformidade}</p>)}
              <p style={{ marginBottom: "50px" }}><strong>Comentarios:</strong> {avaliacao.comentarios}</p>
              
              {(avaliacao.conformidade_teachers_guide || avaliacao.planejamento_aula) && (
  <div style={estiloDiv}>
    {avaliacao.conformidade_teachers_guide && (
      <>
        <p><strong>Conformidade Teachers Guide:</strong></p>
        <p style={{ marginLeft: "30px" }}>{avaliacao.conformidade_teachers_guide}</p>
      </>
    )}
    {avaliacao.planejamento_aula && (
      <>
        <p><strong>Planejamento Aula:</strong></p>
        <p>{avaliacao.planejamento_aula}</p>
      </>
    )}
  </div>
)}

{(avaliacao.oratoria_professor || avaliacao.dominio_tema) && (
  <div style={estiloDiv}>
    {avaliacao.oratoria_professor && (
      <>
        <p><strong>Oratória Professor:</strong></p>
        <p style={{ marginLeft: "95px" }}>{avaliacao.oratoria_professor}</p>
      </>
    )}
    {avaliacao.dominio_tema && (
      <>
        <p><strong>Domínio Tema:</strong></p>
        <p>{avaliacao.dominio_tema}</p>
      </>
    )}
  </div>
)}

{(avaliacao.aplicacao_habilidades_competencias || avaliacao.construcao_pensamento) && (
  <div style={estiloDiv}>
    {avaliacao.aplicacao_habilidades_competencias && (
      <>
        <p><strong>Aplicação Habilidades e Competências:</strong></p>
        <p style={{ marginRight: "18px" }}>{avaliacao.aplicacao_habilidades_competencias}</p>
      </>
    )}
    {avaliacao.construcao_pensamento && (
      <>
        <p><strong>Construção Pensamento:</strong></p>
        <p>{avaliacao.construcao_pensamento}</p>
      </>
    )}
  </div>
)}

{(avaliacao.postura_professor || avaliacao.divisao_tempo_teoria_pratica) && (
  <div style={estiloDiv}>
    {avaliacao.postura_professor && (
      <>
        <p><strong>Postura Professor:</strong></p>
        <p style={{ marginLeft: "157px" }}>{avaliacao.postura_professor}</p>
      </>
    )}
    {avaliacao.divisao_tempo_teoria_pratica && (
      <>
        <p><strong>Divisão Tempo Teoria e Prática:</strong></p>
        <p>{avaliacao.divisao_tempo_teoria_pratica}</p>
      </>
    )}
  </div>
)}

{(avaliacao.criatividade || avaliacao.motivacao_professor) && (
  <div style={estiloDiv}>
    {avaliacao.criatividade && (
      <>
        <p><strong>Criatividade:</strong></p>
        <p style={{ marginLeft: "160px" }}>{avaliacao.criatividade}</p>
      </>
    )}
    {avaliacao.motivacao_professor && (
      <>
        <p><strong>Motivação Professor:</strong></p>
        <p>{avaliacao.motivacao_professor}</p>
      </>
    )}
  </div>
)}

{(avaliacao.controle_turma || avaliacao.atendimento_alunos) && (
  <div style={estiloDiv}>
    {avaliacao.controle_turma && (
      <>
        <p><strong>Controle Turma:</strong></p>
        <p style={{ marginLeft: "135px" }}>{avaliacao.controle_turma}</p>
      </>
    )}
    {avaliacao.atendimento_alunos && (
      <>
        <p><strong>Atendimento Alunos:</strong></p>
        <p>{avaliacao.atendimento_alunos}</p>
      </>
    )}
  </div>
)}

{(avaliacao.metodologia_ativa || avaliacao.nivel_atividade_proposta) && (
  <div style={estiloDiv}>
    {avaliacao.metodologia_ativa && (
      <>
        <p><strong>Metodologia Ativa:</strong></p>
        <p style={{ marginLeft: "129px" }}>{avaliacao.metodologia_ativa}</p>
      </>
    )}
    {avaliacao.nivel_atividade_proposta && (
      <>
        <p><strong>Nível Atividade Proposta:</strong></p>
        <p>{avaliacao.nivel_atividade_proposta}</p>
      </>
    )}
  </div>
)}

{(avaliacao.time_aula || avaliacao.motivacao_alunos) && (
  <div style={estiloDiv}>
    {avaliacao.time_aula && (
      <>
        <p><strong>Time Aula:</strong></p>
        <p style={{ marginLeft: "260px" }}>{avaliacao.time_aula}</p>
      </>
    )}
    {avaliacao.motivacao_alunos && (
      <>
        <p><strong style={{ marginLeft: "95px" }}>Motivação Alunos:</strong></p>
        <p style={{ marginLeft: "100px" }}>{avaliacao.motivacao_alunos}</p>
      </>
    )}
  </div>
)}

            </div>
          ))}
          <button onClick={gerarPDF} className="mt-4 p-2 bg-blue-600 text-white rounded-md">Gerar PDF</button>
        </div>
      )}
    </div>
  );
};

export default Historico;

