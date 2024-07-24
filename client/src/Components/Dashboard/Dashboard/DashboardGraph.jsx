import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { format } from 'date-fns';
import './DashboardGraph.css';

ChartJS.register(...registerables);

const Dashboard = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3002/aula-data');
        console.log(response.data); // Verificar os dados retornados

        if (Array.isArray(response.data)) {
          const dates = response.data.map(entry => format(new Date(entry.date), 'dd/MM/yyyy'));
          const notas = response.data.map(entry => entry.nota);

          setChartData({
            labels: dates,
            datasets: [
              {
                label: 'Evolução da Nota',
                data: notas,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.4,
              },
            ],
          });
        } else {
          console.error('Dados retornados não são um array:', response.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Erro ao buscar dados');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <Line data={chartData} ref={chartRef} />
    </div>
  );
};

export default Dashboard;
