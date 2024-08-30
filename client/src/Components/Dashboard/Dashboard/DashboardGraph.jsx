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
            acc[date] = { Sim: 0, Nao: 0 };
          }
          acc[date][item.retorno] += 1;
          return acc;
        }, {});

        const dates = Object.keys(dateCounts);
        const simCounts = dates.map(date => dateCounts[date].Sim);
        const naoCounts = dates.map(date => dateCounts[date].Nao);

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

    axios.get(`http://localhost:3002/feira/${unidade}`)
      .then(response => {
        const data = response.data;
        const { cronograma, apresentacao, estrutural } = data;

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
                  return value === 1 ? 'Sim' : 'Não';
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

      <div className="dashboard-graphs">
        <div className="graph-container">
          <canvas id="myChartAula"></canvas>
        </div>
        <div className="graph-container">
          <canvas id="myChartContato"></canvas>
        </div>
        <div className="graph-container">
          <canvas id="myChartDiarios"></canvas>
        </div>
        <div className="graph-container">
          <canvas id="myChartFeira"></canvas>
        </div>
        <div className="graph-container">
          <canvas id="myChartPhotosEVideos"></canvas>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
