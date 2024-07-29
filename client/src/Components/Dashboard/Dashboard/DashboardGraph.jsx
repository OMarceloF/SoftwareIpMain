import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns'; // Importar o adaptador de data
import axios from 'axios';
import './DashboardGraph.css';

const Dashboard = () => {
  const [chartDataAula, setChartDataAula] = useState({});
  const [chartDataContato, setChartDataContato] = useState({});
  const [chartDataDiarios, setChartDataDiarios] = useState({});
  const [chartDataFeira, setChartDataFeira] = useState({});
  const chartRefAula = useRef(null);
  const chartRefContato = useRef(null);
  const chartRefDiarios = useRef(null);
  const chartRefFeira = useRef(null);
  const unidade = "BH"; // Pode ser alterado conforme necessário

  useEffect(() => {
    // Buscar dados da API para aula
    axios.get(`http://localhost:3002/aula/${unidade}`)
      .then(response => {
        const data = response.data;
        const dates = data.map(item => new Date(item.date)); // Converter para objetos Date
        const notas = data.map(item => item.nota);

        // Atualizar dados do gráfico
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

    // Buscar dados da API para contato
    axios.get(`http://localhost:3002/contato/${unidade}`)
      .then(response => {
        const data = response.data;
        
        // Contar "Sim" e "Não" por data
        const dateCounts = data.reduce((acc, item) => {
          const date = new Date(item.date).toDateString();
          if (!acc[date]) {
            acc[date] = { Sim: 0, Nao: 0 };
          }
          acc[date][item.retorno] += 1;
          return acc;
        }, {});

        const dates = Object.keys(dateCounts);
        const simCounts = dates.map(date => dateCounts[date].Sim);
        const naoCounts = dates.map(date => dateCounts[date].Nao);

        // Atualizar dados do gráfico
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

    // Buscar dados da API para diarios
    axios.get(`http://localhost:3002/diarios/${unidade}`)
      .then(response => {
        const data = response.data;
        const dates = data.map(item => new Date(item.date)); // Converter para objetos Date
        const notas = data.map(item => item.nota);

        // Atualizar dados do gráfico
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

    // Buscar dados da API para feira
    axios.get(`http://localhost:3002/feira/${unidade}`)
      .then(response => {
        const data = response.data;
        const { cronograma, apresentacao, estrutural } = data;

        // Atualizar dados do gráfico
        setChartDataFeira({
          labels: ['Cronograma', 'Apresentação', 'Estrutural'],
          datasets: [
            {
              label: 'Status',
              data: [
                cronograma === 'Sim' ? 1 : 0,
                apresentacao === 'Sim' ? 1 : 0,
                estrutural === 'Sim' ? 1 : 0
              ],
              backgroundColor: [
                cronograma === 'Sim' ? 'rgba(54, 162, 235, 0.7)' : 'rgba(255, 99, 132, 0.7)',
                apresentacao === 'Sim' ? 'rgba(54, 162, 235, 0.7)' : 'rgba(255, 99, 132, 0.7)',
                estrutural === 'Sim' ? 'rgba(54, 162, 235, 0.7)' : 'rgba(255, 99, 132, 0.7)'
              ],
            },
          ],
        });
      })
      .catch(error => console.error('Erro ao buscar dados:', error));
  }, [unidade]);

  useEffect(() => {
    // Gráfico de aula
    if (Object.keys(chartDataAula).length > 0) {
      const ctxAula = document.getElementById('myChartAula').getContext('2d');
      
      // Destruir gráfico existente se houver
      if (chartRefAula.current) {
        chartRefAula.current.destroy();
      }

      // Criar novo gráfico
      chartRefAula.current = new Chart(ctxAula, {
        type: 'line',
        data: chartDataAula,
        options: {
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'day',
              },
            },
          },
        },
      });
    }

    // Gráfico de contato
    if (Object.keys(chartDataContato).length > 0) {
      const ctxContato = document.getElementById('myChartContato').getContext('2d');
      
      // Destruir gráfico existente se houver
      if (chartRefContato.current) {
        chartRefContato.current.destroy();
      }

      // Criar novo gráfico
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

    // Gráfico de diarios
    if (Object.keys(chartDataDiarios).length > 0) {
      const ctxDiarios = document.getElementById('myChartDiarios').getContext('2d');
      
      // Destruir gráfico existente se houver
      if (chartRefDiarios.current) {
        chartRefDiarios.current.destroy();
      }

      // Criar novo gráfico
      chartRefDiarios.current = new Chart(ctxDiarios, {
        type: 'line',
        data: chartDataDiarios,
        options: {
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'day',
              },
            },
          },
        },
      });
    }

    // Gráfico de feira
    if (Object.keys(chartDataFeira).length > 0) {
      const ctxFeira = document.getElementById('myChartFeira').getContext('2d');
      
      // Destruir gráfico existente se houver
      if (chartRefFeira.current) {
        chartRefFeira.current.destroy();
      }

      // Criar novo gráfico
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
                  return value === 1 ? 'Sim' : 'Não';
                }
              }
            }
          },
        },
      });
    }
  }, [chartDataAula, chartDataContato, chartDataDiarios, chartDataFeira]);

  return (
    <div>
      <h2>Dashboard</h2>
      <div>
        <h3>Gráfico de Notas (Aula)</h3>
        <canvas id="myChartAula"></canvas>
      </div>
      <div>
        <h3>Gráfico de Retornos</h3>
        <canvas id="myChartContato"></canvas>
      </div>
      <div>
        <h3>Gráfico de Notas (Diarios)</h3>
        <canvas id="myChartDiarios"></canvas>
      </div>
      <div>
        <h3>Gráfico de Status (Feira)</h3>
        <canvas id="myChartFeira"></canvas>
      </div>
    </div>
  );
};

export default Dashboard;
