import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
import './DashboardGraph.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const carregarLogoBase64 = async () => {
  const response = await fetch('https://ipgestao.vercel.app/assets/logoIPSemFundo-BMaTX7Rq.png');
  const blob = await response.blob();

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};


const Dashboard = () => {
  const [chartDataAula, setChartDataAula] = useState({});
  const [chartDataContato, setChartDataContato] = useState({});
  const [chartDataDiarios, setChartDataDiarios] = useState({});
  const [chartDataFeira, setChartDataFeira] = useState({});
  // const [chartDataFeira, setChartDataFeira] = useState({});
  const [chartDataFotosEVideos, setChartDataFotosEVideos] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const chartAreaRef = useRef();
  const chartRefAula = useRef(null);
  const chartRefContato = useRef(null);
  const chartRefDiarios = useRef(null);
  const chartRefFeira = useRef(null);
  const chartRefFotosEVideos = useRef(null);
  const unidade = localStorage.getItem('unidadeStorage');
  const [comentariosAula, setComentariosAula] = useState([]);
  const [comentariosContato, setComentariosContato] = useState([]);
  const [comentariosDiarios, setComentariosDiarios] = useState([]);
  const [comentariosFotosEVideos, setComentariosFotosEVideos] = useState([]);
  const [comentarioFeira, setComentarioFeira] = useState('');


  const meses = [
    '', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const exportarPDF = async () => {
    // 🔹 Carrega a logo em base64 para inserção no PDF
    const logoBase64 = await carregarLogoBase64();
  
    // 🔹 Cria um novo PDF
    const pdf = new jsPDF();
    const linhaEspaco = 8;
    let y = 20;
  
    // 🔹 Adiciona a logo
    pdf.addImage(logoBase64, 'PNG', 80, 10, 50, 20);
    y = 35;
  
    // 🔹 Cabeçalho do relatório
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.text("Relatório Pedagógico Sintético", 105, y, { align: "center" });
    y += linhaEspaco * 2;
  
    // 🔹 Informações gerais
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);
    pdf.text(`Unidade: ${unidade}`, 20, y); y += linhaEspaco;
    pdf.text(`Mês: ${meses[selectedMonth]}`, 20, y); y += linhaEspaco;
    pdf.text(`Data de Geração: ${new Date().toLocaleDateString()}`, 20, y); y += linhaEspaco;
    pdf.text(`Observações: Relatório gerado automaticamente com base nas informações lançadas na plataforma.`, 20, y);
    y += linhaEspaco * 2;
  
    // 🔹 Define cores de fundo por seção
    const coresPorSecao = {
      'Aulas': [230, 247, 255],
      'Contato': [255, 241, 224],
      'Diários': [240, 240, 255],
      'Fotos e Vídeos': [255, 248, 232],
      'Feira': [235, 255, 245]
    };
  
    // 🔹 Função auxiliar para adicionar seções com caixas e quebra de página automática
    const addSection = (titulo, dados) => {
      if (y > 260) {
        pdf.addPage();
        y = 20;
      }
  
      const corFundo = coresPorSecao[titulo] || [245, 245, 245];
  
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.setTextColor(33, 37, 41);
      pdf.text(titulo, 20, y);
      y += linhaEspaco;
  
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
  
      if (!dados || dados.length === 0) {
        pdf.text("Sem dados disponíveis.", 20, y);
        y += linhaEspaco * 2;
      } else {
        dados.forEach((linha) => {
          const linhas = pdf.splitTextToSize(linha, 170);
          const paddingTop = 5;
          const paddingBottom = 4;
          const altura = (linhas.length * linhaEspaco) + paddingTop + paddingBottom;
  
          if (y + altura + 10 > 280) {
            pdf.addPage();
            y = 20;
          }
  
          // 🔹 Fundo da caixa
          pdf.setFillColor(...corFundo);
          pdf.roundedRect(18, y - 2, 174, altura + 4, 3, 3, 'F');
  
          // 🔹 Borda da caixa
          pdf.setDrawColor(200);
          pdf.setLineWidth(0.2);
          pdf.roundedRect(18, y - 2, 174, altura + 4, 3, 3);
  
          // 🔹 Texto justificado dentro da caixa
          let yLinha = y + paddingTop;
          linhas.forEach((linhaTexto) => {
            pdf.text(linhaTexto, 20, yLinha, { align: "left" });
            yLinha += linhaEspaco;
          });
  
          y += altura + 10; // Espaço entre as caixas
        });
      }
  
      y += linhaEspaco;
    };
  
    // 🔹 Seções padrão
    addSection("Aulas", chartDataAula.labels?.map((label, i) =>
      `${label} — Nota: ${chartDataAula.datasets?.[0]?.data?.[i] ?? "N/A"} — Comentário: ${comentariosAula?.[i] || "Sem comentário"}`
    ));
  
    addSection("Contato", chartDataContato.labels?.map((label, i) =>
      `${label} — Sim: ${chartDataContato.datasets?.[0]?.data?.[i] ?? 0}, Não: ${chartDataContato.datasets?.[1]?.data?.[i] ?? 0} — Comentário: ${comentariosContato?.[i] || "Sem comentário"}`
    ));
  
    addSection("Diários", chartDataDiarios.labels?.map((label, i) =>
      `${label} — Nota: ${chartDataDiarios.datasets?.[0]?.data?.[i] ?? "N/A"} — Comentário: ${comentariosDiarios?.[i] || "Sem comentário"}`
    ));
  
    addSection("Fotos e Vídeos", chartDataFotosEVideos.labels?.map((label, i) =>
      `${label} — Nota: ${chartDataFotosEVideos.datasets?.[0]?.data?.[i] ?? "N/A"} — Comentário: ${comentariosFotosEVideos?.[i] || "Sem comentário"}`
    ));
  
    // 🔹 Seção "Feira" com análise final e comentário
    const dadosFeira = [
      `Última atualização: ${chartDataFeira.labels?.[0] || "Sem data"}`,
      `Cronograma: ${chartDataFeira.datasets?.[0]?.data?.[0] === 1 ? 'Sim' : 'Não'}`,
      `Apresentação: ${chartDataFeira.datasets?.[0]?.data?.[1] === 1 ? 'Sim' : 'Não'}`,
      `Estrutural: ${chartDataFeira.datasets?.[0]?.data?.[2] === 1 ? 'Sim' : 'Não'}`,
      `Comentário: ${comentarioFeira || "Sem comentário"}`
    ];
    addSection("Feira", dadosFeira);
  
    // 🔹 Salva o PDF
    pdf.save(`relatorio_texto_${unidade}_${selectedMonth}.pdf`);
  };
  
  const handleMonthChange = (event) => {
    // setSelectedMonth(event.target.value);
    setSelectedMonth(parseInt(event.target.value));
  };

  useEffect(() => {

    axios.get(`https://softwareipmain-production.up.railway.app/aula/${unidade}`)
    //axios.get(`http://localhost:3002/aula/${unidade}`)
      .then(response => {
        const data = response.data.filter(item => new Date(item.date).getMonth() + 1 === parseInt(selectedMonth));

        const labels = data.map(item => {
          const dataFormatada = new Date(item.date).toLocaleDateString();
          const regente = item.regente || 'Sem regente';
          return `${dataFormatada} - ${regente}`;
        });

        const notas = data.map(item => item.nota);
        const comentarios = data.map(item => item.comentarios || 'Sem comentário');

        setChartDataAula({
          labels,
          datasets: [{
            label: 'Notas',
            data: notas,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
          }],
        });

        setComentariosAula(comentarios);
      })
      .catch(error => console.error('Erro ao buscar dados:', error));

    axios.get(`https://softwareipmain-production.up.railway.app/contato/${unidade}`)
    //axios.get(`http://localhost:3002/contato/${unidade}`)
      .then(response => {
        const data = response.data.filter(item => new Date(item.date).getMonth() + 1 === parseInt(selectedMonth));

        const dateCounts = {};
        const comentarios = [];

        data.forEach(item => {
          const date = new Date(item.date).toLocaleDateString();
          if (!dateCounts[date]) {
            dateCounts[date] = { Sim: 0, Não: 0, comentario: item.comentarios || 'Sem comentário' };
          }
          dateCounts[date][item.retorno]++;
        });

        const dates = Object.keys(dateCounts);
        const simCounts = dates.map(date => dateCounts[date].Sim);
        const naoCounts = dates.map(date => dateCounts[date].Não);
        const comentarioList = dates.map(date => dateCounts[date].comentario);

        setChartDataContato({
          labels: dates,
          datasets: [
            {
              label: 'Sim',
              data: simCounts,
              backgroundColor: 'rgba(75, 192, 192, 0.7)',
            },
            {
              label: 'Não',
              data: naoCounts,
              backgroundColor: 'rgba(255, 99, 132, 0.7)',
            },
          ],
        });

        setComentariosContato(comentarioList);
      })
      .catch(error => console.error('Erro ao buscar dados:', error));

    axios.get(`https://softwareipmain-production.up.railway.app/diarios/${unidade}`)
    //axios.get(`http://localhost:3002/diarios/${unidade}`)
      .then(response => {
        const data = response.data.filter(item => new Date(item.date).getMonth() + 1 === parseInt(selectedMonth));

        const labels = data.map(item => {
          const dataFormatada = new Date(item.date).toLocaleDateString();
          const regente = item.regente || 'Sem regente';
          return `${dataFormatada} - ${regente}`;
        });

        const notas = data.map(item => item.nota);
        const comentarios = data.map(item => item.comentarios || 'Sem comentário');

        setChartDataDiarios({
          labels,
          datasets: [{
            label: 'Notas',
            data: notas,
            borderColor: 'rgb(153, 102, 255)',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
          }],
        });

        setComentariosDiarios(comentarios);
      })
      .catch(error => console.error('Erro ao buscar dados:', error));

    // axios.get(`http://localhost:3002/feira/${unidade}`)
    //   .then(response => {
    //     const data = response.data;
    //     if (data.length > 0) {
    //       const lastEntry = data[data.length - 1];
    //       const { cronograma, apresentacao, estrutural } = lastEntry;

    //       setChartDataFeira({
    //         labels: ['Cronograma', 'Apresentação', 'Estrutural'],
    //         datasets: [
    //           {
    //             label: 'Status',
    //             data: [
    //               cronograma.toLowerCase() === 'sim' ? 1 : 1,
    //               apresentacao.toLowerCase() === 'sim' ? 1 : 1,
    //               estrutural.toLowerCase() === 'sim' ? 1 : 1
    //             ],
    //             backgroundColor: [
    //               cronograma.toLowerCase() === 'sim' ? 'rgba(54, 162, 235, 0.7)' : 'rgba(255, 99, 132, 0.7)',
    //               apresentacao.toLowerCase() === 'sim' ? 'rgba(54, 162, 235, 0.7)' : 'rgba(255, 99, 132, 0.7)',
    //               estrutural.toLowerCase() === 'sim' ? 'rgba(54, 162, 235, 0.7)' : 'rgba(255, 99, 132, 0.7)'
    //             ],
    //           },
    //         ],
    //       });
    //     }
    //   })
    //   .catch(error => console.error('Erro ao buscar dados:', error));

    axios.get(`https://softwareipmain-production.up.railway.app/feira/${unidade}`)
    //axios.get(`http://localhost:3002/feira/${unidade}`)
      .then(response => {
        const data = response.data.filter(item => new Date(item.date).getMonth() + 1 === parseInt(selectedMonth));

        if (data.length > 0) {
          const lastEntry = data.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
          const { cronograma, apresentacao, estrutural } = lastEntry;
          setComentarioFeira(lastEntry.comentarios || 'Sem comentário');

          setChartDataFeira({
            labels: ['Cronograma', 'Apresentação', 'Estrutural'],
            datasets: [
              {
                label: 'Status',
                data: [
                  cronograma.toLowerCase() === 'sim' ? 1 : 1,
                  apresentacao.toLowerCase() === 'sim' ? 1 : 1,
                  estrutural.toLowerCase() === 'sim' ? 1 : 1
                ],
                backgroundColor: [
                  cronograma.toLowerCase() === 'sim' ? 'rgba(54, 162, 235, 0.7)' : 'rgba(255, 99, 132, 0.7)',
                  apresentacao.toLowerCase() === 'sim' ? 'rgba(54, 162, 235, 0.7)' : 'rgba(255, 99, 132, 0.7)',
                  estrutural.toLowerCase() === 'sim' ? 'rgba(54, 162, 235, 0.7)' : 'rgba(255, 99, 132, 0.7)'
                ],
              },
            ],
          });
        } else {
          setChartDataFeira({
            labels: ['Sem dados'],
            datasets: [
              {
                label: 'Status',
                data: [0], // Mantém o gráfico visível, mas sem dados
                backgroundColor: 'rgba(200, 200, 200, 0.3)', // Cor neutra para indicar ausência de dados
              },
            ],
          });
        }
      })
      .catch(error => {
        console.error('Erro ao buscar dados:', error);
        setChartDataFeira({
          labels: ['Sem dados'],
          datasets: [
            {
              label: 'Status',
              data: [0], // Mantém o gráfico visível, mas sem dados
              backgroundColor: 'rgba(200, 200, 200, 0.3)', // Cor neutra para indicar ausência de dados
            },
          ],
        });
      });


    axios.get(`https://softwareipmain-production.up.railway.app/fotosevideos/${unidade}`)
    //axios.get(`http://localhost:3002/fotosevideos/${unidade}`)
      .then(response => {
        const data = response.data.filter(item => new Date(item.date).getMonth() + 1 === parseInt(selectedMonth));

        if (data.length > 0) {
          const dates = data.map(item => new Date(item.date).toLocaleDateString());
          const notas = data.map(item => item.nota);
          const comentarios = data.map(item => item.comentarios || 'Sem comentário');

          setChartDataFotosEVideos({
            labels: dates,
            datasets: [{
              label: 'Notas',
              data: notas,
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
            }],
          });

          setComentariosFotosEVideos(comentarios);
        } else {
          setChartDataFotosEVideos({
            labels: ['Sem dados'],
            datasets: [{
              label: 'Notas',
              data: [0],
              borderColor: 'rgba(200, 200, 200, 0.3)',
              backgroundColor: 'rgba(200, 200, 200, 0.2)',
            }],
          });
          setComentariosFotosEVideos(['Sem comentário']);
        }
      })
      .catch(error => console.error('Erro ao buscar dados:', error));

    /*//axios.get(`https://softwareipmain-production.up.railway.app/guide/${unidade}`)
    axios.get(`http://localhost:3002/guide/${unidade}`)
      .then(response => {
        const data = response.data.filter(item => new Date(item.date).getMonth() + 1 === parseInt(selectedMonth));

        if (data.length > 0) {
          const dateCounts = data.reduce((acc, item) => {
            const date = new Date(item.date).toLocaleDateString();
            if (!acc[date]) {
              acc[date] = { Sim: 0, Nao: 0 };
            }
            acc[date][item.conformidade] += 1;
            return acc;
          }, {});

          const dates = Object.keys(dateCounts);
          const simCounts = dates.map(date => dateCounts[date].Sim);
          const naoCounts = dates.map(date => dateCounts[date].Nao);

          setChartDataGuide({
            labels: dates,
            datasets: [
              {
                label: 'Sim',
                data: simCounts,
                backgroundColor: 'rgba(75, 192, 192, 0.7)',
              },
              {
                label: 'Não',
                data: naoCounts,
                backgroundColor: 'rgba(255, 99, 132, 0.7)',
              },
            ],
          });
        } else {
          setChartDataGuide({ labels: [], datasets: [] });
        }
      })
      .catch(error => console.error('Erro ao buscar dados:', error));*/

    /*//axios.get(`https://softwareipmain-production.up.railway.app/planos/${unidade}`)
    axios.get(`http://localhost:3002/planos/${unidade}`)
      .then(response => {
        const data = response.data.filter(item => new Date(item.date).getMonth() + 1 === parseInt(selectedMonth));

        const labels = data.map(item => {
          const dataFormatada = new Date(item.date).toLocaleDateString();
          const regente = item.regente || 'Sem regente';
          return `${dataFormatada} - ${regente}`;
        });

        const notas = data.map(item => item.nota);
        const comentarios = data.map(item => item.comentarios || 'Sem comentário');

        setChartDataPlanos({
          labels,
          datasets: [{
            label: 'Notas',
            data: notas,
            borderColor: 'rgb(255, 159, 64)',
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
          }],
        });

        setComentariosPlanos(comentarios);
      })
      .catch(error => console.error('Erro ao buscar dados:', error));*/

  }, [unidade, selectedMonth]);

  useEffect(() => {
    if (Object.keys(chartDataAula).length > 0) {
      const ctxAula = document.getElementById('myChartAula').getContext('2d');
      if (chartRefAula.current) {
        chartRefAula.current.destroy();
      }
      chartRefAula.current = new Chart(ctxAula, {
        type: 'line',
        data: chartDataAula,
        options: {
          scales: {
            x: {
              type: 'category',
            },
            y: {
              min: 0,
              max: 10,
              beginAtZero: true
            },
          },
        },
      });
    }

    if (Object.keys(chartDataContato).length > 0) {
      const ctxContato = document.getElementById('myChartContato').getContext('2d');
      if (chartRefContato.current) {
        chartRefContato.current.destroy();
      }
      chartRefContato.current = new Chart(ctxContato, {
        type: 'bar',
        data: chartDataContato,
        options: {
          scales: {
            x: {
              type: 'category',
              stacked: true,
              title: {
                display: true,
                text: 'Data'
              }
            },
            y: {
              stacked: true,
              title: {
                display: true,
                text: 'Contagem'
              }
            }
          },
          plugins: {
            legend: {
              position: 'top',
            },
          },
        },
      });
    }

    if (Object.keys(chartDataDiarios).length > 0) {
      const ctxDiarios = document.getElementById('myChartDiarios').getContext('2d');
      if (chartRefDiarios.current) {
        chartRefDiarios.current.destroy();
      }
      chartRefDiarios.current = new Chart(ctxDiarios, {
        type: 'line',
        data: chartDataDiarios,
        options: {
          scales: {
            x: {
              type: 'category',
            },
            y: {
              min: 0,
              max: 10,
              beginAtZero: true
            },
          },
        },
      });
    }

    // if (Object.keys(chartDataFeira).length > 0) {
    //   const ctxFeira = document.getElementById('myChartFeira').getContext('2d');
    //   if (chartRefFeira.current) {
    //     chartRefFeira.current.destroy();
    //   }
    //   chartRefFeira.current = new Chart(ctxFeira, {
    //     type: 'bar',
    //     data: chartDataFeira,
    //     options: {
    //       indexAxis: 'x',
    //       elements: {
    //         bar: {
    //           borderWidth: 2,
    //         },
    //       },
    //       responsive: true,
    //       plugins: {
    //         legend: {
    //           position: 'top',
    //         },
    //         tooltip: {
    //           callbacks: {
    //             label: function (context) {
    //               const value = context.raw;
    //               return backgroundColor === 'rgba(54, 162, 235, 0.7)' ? 'Sim' : 'Não';
    //             },
    //           },
    //         },
    //       },
    //     },
    //   });
    // }

    // Se não há dados, remover o gráfico
    // if (!chartDataFeira) {
    //   if (chartRefFeira.current) {
    //     chartRefFeira.current.destroy();
    //   }
    //   return;
    // }

    if (chartRefFeira.current) {
      chartRefFeira.current.destroy();
      chartRefFeira.current = null;
    }

    if (chartDataFeira && chartDataFeira.labels && chartDataFeira.labels.length > 0) {
      const canvas = document.getElementById('myChartFeira');

      if (canvas) {
        const ctxFeira = canvas.getContext('2d');

        if (ctxFeira) {
          chartRefFeira.current = new Chart(ctxFeira, {
            type: 'bar',
            data: chartDataFeira,
            options: {
              indexAxis: 'x',
              elements: {
                bar: {
                  borderWidth: 2,
                },
              },
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      return context.raw === 1 ? 'Sim' : 'Não';
                    },
                  },
                },
              },
            },
          });
        }
      }
    }

    if (Object.keys(chartDataFotosEVideos).length > 0) {
      const ctxPhotosEVideos = document.getElementById('myChartPhotosEVideos').getContext('2d');
      if (chartRefFotosEVideos.current) {
        chartRefFotosEVideos.current.destroy();
        chartRefFotosEVideos.current = null;
      }
      chartRefFotosEVideos.current = new Chart(ctxPhotosEVideos, {
        type: 'line',
        data: chartDataFotosEVideos,
        options: {
          scales: {
            x: {
              type: 'category',
            },
            y: {
              min: 0,
              max: 10,
              beginAtZero: true
            },
          },
        },
      });
    }

    /*if (Object.keys(chartDataGuide).length > 0) {
      const ctxGuide = document.getElementById('myChartGuide').getContext('2d');
      if (chartRefGuide.current) {
        chartRefGuide.current.destroy();
        chartRefGuide.current = null;
      }
      chartRefGuide.current = new Chart(ctxGuide, {
        type: 'bar',
        data: chartDataGuide,
        options: {
          scales: {
            x: {
              type: 'category',
              stacked: true,
              title: {
                display: true,
                text: 'Data'
              }
            },
            y: {
              stacked: true,
              title: {
                display: true,
                text: 'Contagem'
              }
            }
          },
          plugins: {
            legend: {
              position: 'top',
            },
          },
        },
      });
    }*/

    /*if (Object.keys(chartDataPlanos).length > 0) {
      const ctxPlanos = document.getElementById('myChartPlanos').getContext('2d');
      if (chartRefPlanos.current) {
        chartRefPlanos.current.destroy();
        chartRefPlanos.current = null;
      }
      chartRefPlanos.current = new Chart(ctxPlanos, {
        type: 'line',
        data: chartDataPlanos,
        options: {
          scales: {
            x: {
              type: 'category',
            },
            y: {
              min: 0,
              max: 10,
              beginAtZero: true
            },
          },
        },
      });
    }*/


  }, [chartDataAula, chartDataContato, chartDataDiarios, chartDataFeira, chartDataFotosEVideos]);

  return (
    <div>
      <div>
        <label htmlFor="month-select">Selecione o Mês:</label>
        <select id="month-select" value={selectedMonth} onChange={handleMonthChange}>
          <option value="1">Janeiro</option>
          <option value="2">Fevereiro</option>
          <option value="3">Março</option>
          <option value="4">Abril</option>
          <option value="5">Maio</option>
          <option value="6">Junho</option>
          <option value="7">Julho</option>
          <option value="8">Agosto</option>
          <option value="9">Setembro</option>
          <option value="10">Outubro</option>
          <option value="11">Novembro</option>
          <option value="12">Dezembro</option>
        </select>
      </div>

      {unidade && (
        <div ref={chartAreaRef}>
          <div className="somente-pdf">
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Relatório Pedagógico Sintético</h2>
            <p><strong>Unidade:</strong> {unidade}</p>
            <p><strong>Mês:</strong> {meses[selectedMonth]}</p>
            <p><strong>Data de Geração:</strong> {new Date().toLocaleDateString()}</p>
            <p><strong>Observações:</strong> Relatório gerado automaticamente com base nas informações lançadas na plataforma.</p>

            <hr />

            <h3>🧪 Aulas</h3>
            {chartDataAula.labels?.map((label, i) => (
              <p key={i}><strong>{label}</strong> — Nota: {chartDataAula.datasets?.[0]?.data?.[i] ?? 'N/A'}</p>
            ))}

            <h3>📞 Contato</h3>
            {chartDataContato.labels?.map((label, i) => (
              <p key={i}>
                <strong>{label}</strong> — Sim: {chartDataContato.datasets?.[0]?.data?.[i] ?? 0}, Não: {chartDataContato.datasets?.[1]?.data?.[i] ?? 0}
              </p>
            ))}

            <h3>📘 Diários</h3>
            {chartDataDiarios.labels?.map((label, i) => (
              <p key={i}><strong>{label}</strong> — Nota: {chartDataDiarios.datasets?.[0]?.data?.[i] ?? 'N/A'}</p>
            ))}

            <h3>📸 Fotos e Vídeos</h3>
            {chartDataFotosEVideos.labels?.map((label, i) => (
              <p key={i}><strong>{label}</strong> — Nota: {chartDataFotosEVideos.datasets?.[0]?.data?.[i] ?? 'N/A'}</p>
            ))}

          </div>

          <div className="informacoes-relatorio">
            <p><strong>Unidade:</strong> {unidade}</p>
            <p><strong>Responsável:</strong> Coordenador Pedagógico</p>
            <p><strong>Data de Geração:</strong> {new Date().toLocaleDateString()}</p>
            <p><strong>Mês de Referência:</strong> {meses[selectedMonth]}</p>
            <p><strong>Observações:</strong> Todos os dados foram extraídos automaticamente da base da plataforma.</p>
          </div>

          <div className="chart-container">
            <div className="chart pdf-visible">
              <h2>Aula</h2>
              <canvas id="myChartAula"></canvas>
            </div>

            <div className="chart pdf-visible">
              <h2>Contato</h2>
              <canvas id="myChartContato"></canvas>
            </div>

            <div className="chart pdf-visible">
              <h2>Diários</h2>
              <canvas id="myChartDiarios"></canvas>
            </div>

            <div className="chart pdf-visible">
              <h2>Feira</h2>
              <canvas id="myChartFeira"></canvas>
            </div>

            <div className="chart pdf-visible">
              <h2>Fotos e Vídeos</h2>
              <canvas id="myChartPhotosEVideos"></canvas>
            </div>
          </div>

          {/* Botão de exportação só aparece com unidade selecionada */}
          <div
            className="no-print"
            style={{ textAlign: 'center', margin: '30px 0' }}
          >
            <button onClick={exportarPDF} className="botao-pdf">
              Gerar Relatório em PDF
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default Dashboard;
