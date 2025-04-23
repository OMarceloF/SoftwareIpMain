import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import jsPDF from 'jspdf';

const carregarLogoBase64 = async () => {
  const response = await fetch('https://ipgestao.vercel.app/assets/logoIPSemFundo-BMaTX7Rq.png'); // Caminho local da sua logo
  const blob = await response.blob();

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

const DashboardGraphCor = () => {
  const [coordenador, setCoordenador] = useState("");
  const [coordenadores, setCoordenadores] = useState([]);
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [dados, setDados] = useState({});
  const filtrarPorMes = (dados, mes) => {
    return dados.filter(item => new Date(item.date).getMonth() + 1 === mes);
  };

  useEffect(() => {
    axios.get("https://softwareipmain-production.up.railway.app/coordenadores")
    //axios.get("http://localhost:3002/coordenadores")
      .then(response => {
        setCoordenadores(response.data);
        if (response.data.length === 1) {
          setCoordenador(response.data[0].username);
        }
      })
      .catch(error => console.error("Erro ao buscar coordenadores:", error));

    axios.get("https://softwareipmain-production.up.railway.app/coordenadores")
    //axios.get("http://localhost:3002/coordenadores")

      .then(response => {
        setCoordenadores(response.data);
        if (response.data.length === 1) {
          setCoordenador(response.data[0].username);
        }
      })
      .catch(error => console.error("Erro ao buscar coordenadores:", error));
  }, []);

  useEffect(() => {
    if (coordenador) {
      axios.get(`https://softwareipmain-production.up.railway.app/aulacor/${encodeURIComponent(coordenador)}`)
      //axios.get(`http://localhost:3002/aulacor/${encodeURIComponent(coordenador)}`)
        .then(response => {
          const dadosFiltrados = filtrarPorMes(response.data, mes);
          console.log("Dados recebidos:", response.data); // Verifica os dados recebidos
          setDados({ aulascor: dadosFiltrados }); // Ajuste para armazenar corretamente os dados
        })
        .catch(error => console.error("Erro ao buscar dados:", error));
      axios.get(`https://softwareipmain-production.up.railway.app/contatocor/${encodeURIComponent(coordenador)}`)
      //axios.get(`http://localhost:3002/contatocor/${encodeURIComponent(coordenador)}`)
        .then(response => {
          const dadosFiltrados = filtrarPorMes(response.data, mes);
          setDados(prev => ({ ...prev, contatocor: dadosFiltrados }));
        })
        .catch(error => console.error("Erro ao buscar dados de contatos:", error));
      axios.get(`https://softwareipmain-production.up.railway.app/diarioscor/${encodeURIComponent(coordenador)}`)
      //axios.get(`http://localhost:3002/diarioscor/${encodeURIComponent(coordenador)}`)
        .then(response => {
          const dadosFiltrados = filtrarPorMes(response.data, mes);
          setDados(prev => ({ ...prev, diarioscor: dadosFiltrados }));
        })
        .catch(error => console.error("Erro ao buscar dados de diários:", error));

      axios.get(`https://softwareipmain-production.up.railway.app/fotosevideoscor/${encodeURIComponent(coordenador)}`)
      //axios.get(`http://localhost:3002/fotosevideoscor/${encodeURIComponent(coordenador)}`)
        .then(response => {
          const dadosFiltrados = filtrarPorMes(response.data, mes);
          setDados(prev => ({ ...prev, fotosevideoscor: dadosFiltrados }));
        })
        .catch(error => console.error("Erro ao buscar dados de fotos e vídeos:", error));

      axios.get(`https://softwareipmain-production.up.railway.app/feiracor/${encodeURIComponent(coordenador)}`)
      //axios.get(`http://localhost:3002/feiracor/${encodeURIComponent(coordenador)}`)
        .then(response => {
          const dadosFiltrados = filtrarPorMes(response.data, mes);
          if (dadosFiltrados.length > 0) {
            const ultimaEntrada = dadosFiltrados.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
            setDados(prev => ({ ...prev, feiracor: ultimaEntrada }));
          } else {
            setDados(prev => ({ ...prev, feiracor: null }));
          }
        })
        .catch(error => console.error("Erro ao buscar dados de feira:", error));
    }
  }, [coordenador, mes]);

  const gerarDadosGrafico = (chave, labelY) => {
    const valores = dados[chave] || []; // Se `dados[chave]` for undefined, usa um array vazio
    return {
      labels: valores.map(item => new Date(item.date).toLocaleDateString("pt-BR")),
      datasets: [
        {
          label: labelY,
          data: valores.map(item => item.nota ? item.nota : item.quantidade || 0), // Garante que sempre há um valor
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
      ],
    };
  };
  // 🔽 Função para exportar relatório em PDF (texto apenas)
  // 🔹 Função para exportar o relatório em PDF (texto apenas, com logo e visual bonito)
const exportarRelatorioTextoPDF = async () => {
  const pdf = new jsPDF();
  const linhaEspaco = 8;
  let y = 20;

  // 🔹 Carrega a logo em base64
  const logoBase64 = await carregarLogoBase64();
  pdf.addImage(logoBase64, 'PNG', 80, 10, 50, 20); // Insere a logo no topo centralizado
  y = 35; // Avança o Y para não sobrepor a logo

  // 🔹 Lista de meses (para exibir o nome corretamente)
  const meses = [
    '', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  // 🔹 Cabeçalho de informações gerais
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text("Relatório Pedagógico - Coordenador", 105, y, { align: "center" });
  y += linhaEspaco * 2;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.text(`Coordenador: ${coordenador}`, 20, y); y += linhaEspaco;
  pdf.text(`Mês: ${meses[mes]}`, 20, y); y += linhaEspaco;
  pdf.text(`Data de Geração: ${new Date().toLocaleDateString()}`, 20, y); y += linhaEspaco * 2;

  // 🔹 Cores de fundo para cada seção
  const coresPorSecao = {
    "Aulas": [230, 247, 255],
    "Contato": [255, 241, 224],
    "Diários": [240, 240, 255],
    "Fotos e Vídeos": [255, 248, 232],
    "Feira": [235, 255, 245]
  };

  // 🔹 Função auxiliar para adicionar seções organizadas
  const addSection = (titulo, linhas) => {
    const corFundo = coresPorSecao[titulo] || [245, 245, 245];

    if (y > 260) {
      pdf.addPage(); // Quebra de página se necessário
      y = 20;
    }

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.setTextColor(33, 37, 41);
    pdf.text(titulo, 20, y);
    y += linhaEspaco;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);

    if (!linhas || linhas.length === 0) {
      pdf.text("Sem dados disponíveis.", 20, y);
      y += linhaEspaco;
    } else {
      linhas.forEach((linha) => {
        const textoDividido = pdf.splitTextToSize(linha, 170);
        const altura = textoDividido.length * linhaEspaco + 10;

        if (y + altura > 280) {
          pdf.addPage();
          y = 20;
        }

        // 🔹 Fundo colorido da caixa
        pdf.setFillColor(...corFundo);
        pdf.roundedRect(18, y - 2, 174, altura, 3, 3, 'F');

        // 🔹 Borda da caixa
        pdf.setDrawColor(200);
        pdf.setLineWidth(0.2);
        pdf.roundedRect(18, y - 2, 174, altura, 3, 3);

        // 🔹 Texto dentro da caixa
        let yLinha = y + 5;
        textoDividido.forEach(txt => {
          pdf.text(txt, 20, yLinha);
          yLinha += linhaEspaco;
        });

        y += altura + 5;
      });
    }

    y += linhaEspaco;
  };

  // 🔹 Prepara os dados para cada seção

  const linhasAula = dados.aulascor?.map(item =>
    `${new Date(item.date).toLocaleDateString("pt-BR")} - ${item.regente || item.nome_professor || item.instrutor || "Sem regente"} — Nota: ${item.nota ?? "N/A"} — Comentário: ${item.comentarios ?? "Sem comentário"}`
  ) || [];

  const linhasContato = dados.contatocor?.map(item =>
    `${new Date(item.date).toLocaleDateString("pt-BR")} — Retorno: ${item.retorno ?? "N/A"} — Comentário: ${item.comentarios ?? "Sem comentário"}`
  ) || [];

  const linhasDiarios = dados.diarioscor?.map(item =>
    `${new Date(item.date).toLocaleDateString("pt-BR")} - ${item.regente || item.nome_professor || item.instrutor || "Sem regente"} — Nota: ${item.nota ?? "N/A"} — Comentário: ${item.comentarios ?? "Sem comentário"}`
  ) || [];

  const linhasFotos = dados.fotosevideoscor?.map(item =>
    `${new Date(item.date).toLocaleDateString("pt-BR")} - ${item.regente || item.nome_professor || item.instrutor || "Sem regente"} — Nota: ${item.nota ?? "N/A"} — Comentário: ${item.comentarios ?? "Sem comentário"}`
  ) || [];

  const linhasFeira = dados.feiracor ? [
    `Data: ${new Date(dados.feiracor.date).toLocaleDateString("pt-BR")}`,
    `Cronograma: ${dados.feiracor.cronograma}`,
    `Estrutural: ${dados.feiracor.estrutural}`,
    `Apresentação: ${dados.feiracor.apresentacao}`,
    `Comentário: ${dados.feiracor.comentarios ?? "Sem comentário"}`
  ] : [];

  // 🔹 Monta o relatório chamando as seções
  addSection("Aulas", linhasAula);
  addSection("Contato", linhasContato);
  addSection("Diários", linhasDiarios);
  addSection("Fotos e Vídeos", linhasFotos);
  addSection("Feira", linhasFeira);

  // 🔹 Salva o arquivo final
  pdf.save(`relatorio_texto_${coordenador}_${mes}.pdf`);
};


  const gerarDadosGraficoContatos = () => {
    const valores = dados.contatocor || [];
    const labels = valores.map(item => new Date(item.date).toLocaleDateString("pt-BR"));
    const dataUnica = labels.map((label, index) => 1);
    const cores = labels.map((label, index) => valores[index].retorno === "Sim" ? "rgba(75, 192, 192, 0.6)" : "rgba(255, 99, 132, 0.6)");

    return {
      labels: labels,
      datasets: [
        {
          label: "Houve retorno",
          data: dataUnica,
          backgroundColor: cores,
          barThickness: 40,
        }
      ],
    };
  };

  const gerarDadosGraficoFeira = () => {
    if (!dados.feiracor) return { labels: [], datasets: [] };
    const { cronograma, estrutural, apresentacao, date } = dados.feiracor;
    const labels = ["Cronograma", "Estrutural", "Apresentação"];
    const valores = [cronograma, estrutural, apresentacao];
    const cores = valores.map(valor => valor.toLowerCase() === "sim" ? "rgba(54, 162, 235, 0.7)" : "rgba(255, 99, 132, 0.7)");

    return {
      labels: labels,
      datasets: [
        {
          label: `Status - ${new Date(date).toLocaleDateString("pt-BR")}`,
          data: [1, 1, 1],
          backgroundColor: cores,
        },
      ],
    };
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Dashboard do Coordenador</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Selecione o Coordenador:</label>
        <select
          className="mt-1 block w-full p-2 border rounded-md"
          value={coordenador}
          onChange={(e) => setCoordenador(e.target.value)}
        >
          <option value="">Selecione um Coordenador</option>
          {coordenadores.map((coord) => (
            <option key={coord.username} value={coord.username}>{coord.username}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Selecione o Mês:</label>
        <select
          className="mt-1 block w-full p-2 border rounded-md"
          value={mes}
          onChange={(e) => setMes(parseInt(e.target.value))}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("pt-BR", { month: "long" })}
            </option>
          ))}
        </select>
      </div>

      {mes && coordenador && (
        <div className="chart-container">
          <div className="chart">
            <h3 className="text-lg font-semibold">Aulas</h3>
            <Bar
              data={gerarDadosGrafico("aulascor", "Nota das Aulas")}
              options={{
                scales: {
                  y: {
                    min: 0,
                    max: 10,
                    beginAtZero: true,
                  }
                }
              }}
            />
          </div>
          <div className="chart">
            <h3 className="text-lg font-semibold">Contatos</h3>
            <Bar
              data={gerarDadosGraficoContatos()}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    min: 0,
                    max: 1,
                    ticks: {
                      display: false,
                    }
                  }
                }
              }}
            />
          </div>
          <div className="chart">
            <h3 className="text-lg font-semibold">Diários</h3>
            <Bar
              data={gerarDadosGrafico("diarioscor", "Nota dos Diários")}
              options={{
                scales: {
                  y: {
                    min: 0,
                    max: 10,
                    beginAtZero: true,
                  }
                }
              }}
            />
          </div>
          <div className="chart">
            <h3 className="text-lg font-semibold">Feiras</h3>
            <Bar
              data={gerarDadosGraficoFeira()}
              options={{
                scales: {
                  y: {
                    min: 0,
                    max: 1,
                    beginAtZero: true,
                  }
                }
              }}
            />
          </div>
          <div className="chart">
            <h3 className="text-lg font-semibold">Fotos e Vídeos</h3>
            <Bar
              data={gerarDadosGrafico("fotosevideoscor", "Nota das Fotos e Vídeos")}
              options={{
                scales: {
                  y: {
                    min: 0,
                    max: 10,
                    beginAtZero: true,
                  }
                }
              }}
            />
          </div>
        </div>

      )}{/* 🔘 Botão para gerar relatório de texto em PDF */}
      {coordenador && mes && (
        <div className="mt-8 text-center">
          <button
            onClick={exportarRelatorioTextoPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Gerar Relatório em PDF
          </button>
        </div>
      )}


    </div>
  );
};

export default DashboardGraphCor;
