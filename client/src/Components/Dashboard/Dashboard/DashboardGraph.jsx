import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns'; // Importar o adaptador de data
import axios from 'axios';
import './DashboardGraph.css';

const Dashboard = () => {
  const [chartData, setChartData] = useState({});
  const chartRef = useRef(null);
  const unidade = "BH"; // Pode ser alterado conforme necessário

  useEffect(() => {
    // Buscar dados da API
    axios.get(`http://localhost:3002/aula/${unidade}`)
      .then(response => {
        const data = response.data;
        const dates = data.map(item => new Date(item.date)); // Converter para objetos Date
        const notas = data.map(item => item.nota);

        // Atualizar dados do gráfico
        setChartData({
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
  }, [unidade]);

  useEffect(() => {
    if (Object.keys(chartData).length > 0) {
      const ctx = document.getElementById('myChart').getContext('2d');
      
      // Destruir gráfico existente se houver
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      // Criar novo gráfico
      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: chartData,
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
  }, [chartData]);

  return (
    <div>
      <h2>Dashboard</h2>
      <canvas id="myChart"></canvas>
    </div>
  );
};

export default Dashboard;
