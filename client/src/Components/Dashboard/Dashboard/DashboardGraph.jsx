import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
import './DashboardGraph.css';

const Dashboard = () => {
  const [chartDataAula, setChartDataAula] = useState({});
  const [chartDataContato, setChartDataContato] = useState({});
  const [chartDataDiarios, setChartDataDiarios] = useState({});
  const [chartDataFeira, setChartDataFeira] = useState({});
  const [chartDataFotosEVideos, setChartDataFotosEVideos] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Mês atual
  const chartRefAula = useRef(null);
  const chartRefContato = useRef(null);
  const chartRefDiarios = useRef(null);
  const chartRefFeira = useRef(null);
  const chartRefFotosEVideos = useRef(null);
  const [chartDataGuide, setChartDataGuide] = useState({});
  const chartRefGuide = useRef(null);
  const [chartDataPlanos, setChartDataPlanos] = useState({});
  const chartRefPlanos = useRef(null);
  const unidade = localStorage.getItem('unidadeStorage');

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  useEffect(() => {
    axios.get(`http://localhost:3002/aula/${unidade}`)
      .then(response => {
        const data = response.data.filter(item => new Date(item.date).getMonth() + 1 === parseInt(selectedMonth));
        const dates = data.map(item => new Date(item.date).toLocaleDateString());
        const notas = data.map(item => item.nota);

        setChartDataAula({
          labels: dates,
          datasets: [
            {
              label: 'Notas',
              data: notas,
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
            },
          ],
        });
      })
      .catch(error => console.error('Erro ao buscar dados:', error));

    axios.get(`http://localhost:3002/contato/${unidade}`)
      .then(response => {
        const data = response.data.filter(item => new Date(item.date).getMonth() + 1 === parseInt(selectedMonth));

        const dateCounts = data.reduce((acc, item) => {
          const date = new Date(item.date).toLocaleDateString();
          if (!acc[date]) {
            acc[date] = { Sim: 0, Não: 0 };
          }
          acc[date][item.retorno] += 1;
          return acc;
        }, {});

        const dates = Object.keys(dateCounts);
        const simCounts = dates.map(date => dateCounts[date].Sim);
        const naoCounts = dates.map(date => dateCounts[date].Não);

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
      })
      .catch(error => console.error('Erro ao buscar dados:', error));

    axios.get(`http://localhost:3002/diarios/${unidade}`)
      .then(response => {
        const data = response.data.filter(item => new Date(item.date).getMonth() + 1 === parseInt(selectedMonth));
        const dates = data.map(item => new Date(item.date).toLocaleDateString());
        const notas = data.map(item => item.nota);

        setChartDataDiarios({
          labels: dates,
          datasets: [
            {
              label: 'Notas',
              data: notas,
              borderColor: 'rgb(153, 102, 255)',
              backgroundColor: 'rgba(153, 102, 255, 0.2)',
            },
          ],
        });
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

    axios.get(`http://localhost:3002/feira/${unidade}`)
      .then(response => {
        // Converter as datas e filtrar apenas registros do mês selecionado
        const data = response.data.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate.getMonth() + 1 === parseInt(selectedMonth);
        });

        if (data.length > 0) {
          // Ordenar os registros por data e pegar o mais recente dentro do mês
          const lastEntry = data.sort((a, b) => new Date(b.date) - new Date(a.date))[0];

          const { cronograma, apresentacao, estrutural } = lastEntry;

          setChartDataFeira({
            labels: ['Cronograma', 'Apresentação', 'Estrutural'],
            datasets: [
              {
                label: 'Status',
                data: [
                  cronograma.toLowerCase() === 'sim' ? 1 : 0, // Agora a barra desaparece se não houver dados
                  apresentacao.toLowerCase() === 'sim' ? 1 : 0,
                  estrutural.toLowerCase() === 'sim' ? 1 : 0
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
          // Se não houver dados para o mês, remover completamente os dados do gráfico
          setChartDataFeira({
            labels: [],
            datasets: [],
          });
        }
      })
      .catch(error => console.error('Erro ao buscar dados:', error));


    axios.get(`http://localhost:3002/fotosevideos/${unidade}`)
      .then(response => {
        const data = response.data.filter(item => new Date(item.date).getMonth() + 1 === parseInt(selectedMonth));
        const dates = data.map(item => new Date(item.date).toLocaleDateString());
        const notas = data.map(item => item.nota);

        setChartDataFotosEVideos({
          labels: dates,
          datasets: [
            {
              label: 'Notas',
              data: notas,
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
            },
          ],
        });
      })
      .catch(error => console.error('Erro ao buscar dados:', error));

    axios.get(`http://localhost:3002/guide/${unidade}`)
      .then(response => {
        const data = response.data.filter(item => new Date(item.date).getMonth() + 1 === parseInt(selectedMonth));

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
      })
      .catch(error => console.error('Erro ao buscar dados:', error));

      axios.get(`http://localhost:3002/planos/${unidade}`)
      .then(response => {
        const data = response.data.filter(item => new Date(item.date).getMonth() + 1 === parseInt(selectedMonth));
        const dates = data.map(item => new Date(item.date).toLocaleDateString());
        const notas = data.map(item => item.nota);

        setChartDataPlanos({
          labels: dates,
          datasets: [
            {
              label: 'Notas',
              data: notas,
              borderColor: 'rgb(255, 159, 64)',
              backgroundColor: 'rgba(255, 159, 64, 0.2)',
            },
          ],
        });
      })
      .catch(error => console.error('Erro ao buscar dados:', error));

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
    //               return value === 1 ? 'Sim' : 'Não';
    //             },
    //           },
    //         },
    //       },
    //     },
    //   });
    // }
    if (Object.keys(chartDataFeira).length > 0) {
      const ctxFeira = document.getElementById('myChartFeira').getContext('2d');
      if (chartRefFeira.current) {
        chartRefFeira.current.destroy();
      }
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
                  const value = context.raw;
                  return backgroundColor === 'rgba(54, 162, 235, 0.7)' ? 'Sim' : 'Não';
                },
              },
            },
          },
        },
      });
    }

    if (Object.keys(chartDataFotosEVideos).length > 0) {
      const ctxPhotosEVideos = document.getElementById('myChartPhotosEVideos').getContext('2d');
      if (chartRefFotosEVideos.current) {
        chartRefFotosEVideos.current.destroy();
      }
      chartRefFotosEVideos.current = new Chart(ctxPhotosEVideos, {
        type: 'line',
        data: chartDataFotosEVideos,
        options: {
          scales: {
            x: {
              type: 'category',
            },
          },
        },
      });
    }

    if (Object.keys(chartDataGuide).length > 0) {
      const ctxGuide = document.getElementById('myChartGuide').getContext('2d');
      if (chartRefGuide.current) {
        chartRefGuide.current.destroy();
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
    }

    if (Object.keys(chartDataPlanos).length > 0) {
      const ctxPlanos = document.getElementById('myChartPlanos').getContext('2d');
      if (chartRefPlanos.current) {
        chartRefPlanos.current.destroy();
      }
      chartRefPlanos.current = new Chart(ctxPlanos, {
        type: 'line',
        data: chartDataPlanos,
        options: {
          scales: {
            x: {
              type: 'category',
            },
          },
        },
      });
    }

  }, [chartDataAula, chartDataContato, chartDataDiarios, chartDataFeira, chartDataFotosEVideos, chartDataGuide, chartDataPlanos]);

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

      <div className="chart-container">
        <div className="chart">
          <h2>Aula</h2>
          <canvas id="myChartAula"></canvas>
        </div>
        <div className="chart">
          <h2>Contato</h2>
          <canvas id="myChartContato"></canvas>
        </div>
        <div className="chart">
          <h2>Diarios</h2>
          <canvas id="myChartDiarios"></canvas>
        </div>
        <div className="chart">
          <h2>Feira</h2>
          <canvas id="myChartFeira"></canvas>
        </div>
        <div className="chart">
          <h2>Fotos e Vídeos</h2>
          <canvas id="myChartPhotosEVideos"></canvas>
        </div>
        <div className="chart">
          <h2>Guia de Conformidade</h2>
          <canvas id="myChartGuide"></canvas>
        </div>
        <div className="chart">
          <h2>Planos de Aula</h2>
          <canvas id="myChartPlanos"></canvas>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
