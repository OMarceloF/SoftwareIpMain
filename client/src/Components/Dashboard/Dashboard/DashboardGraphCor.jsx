import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Registro dos componentes do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [dataNotas, setDataNotas] = useState(null); // Dados para o gráfico de notas
  const [dataRetorno, setDataRetorno] = useState(null); // Dados para o gráfico de retorno
  const [error, setError] = useState(null); // Estado para armazenar erros
  const [loading, setLoading] = useState(true); // Estado para mostrar carregamento
  const chartNotasRef = useRef(null); // Referência para o canvas do gráfico de notas
  const chartRetornoRef = useRef(null); // Referência para o canvas do gráfico de retorno
  const chartNotasInstance = useRef(null); // Referência para a instância do gráfico de notas
  const chartRetornoInstance = useRef(null); // Referência para a instância do gráfico de retorno

  useEffect(() => {
    // Buscar dados para o gráfico de notas
    axios.get('http://localhost:3002/aulacor/notas-por-coordenador')
      .then(response => {
        console.log("Dados de notas recebidos da API:", response.data); // Log para verificar os dados recebidos
        const filteredDataNotas = filtrarDadosNotas(response.data); // Filtra os dados de notas
        setDataNotas(filteredDataNotas);
      })
      .catch(error => {
        console.error("Erro ao buscar dados de notas:", error);
        setError(error);
      });

    // Buscar dados para o gráfico de retorno
    axios.get('http://localhost:3002/contatocor/retornos-por-coordenador')
      .then(response => {
        console.log("Dados de retorno recebidos da API:", response.data); // Log para verificar os dados recebidos
        const filteredDataRetorno = filtrarDadosRetorno(response.data); // Filtra os dados de retorno
        setDataRetorno(filteredDataRetorno);
      })
      .catch(error => {
        console.error("Erro ao buscar dados de retorno:", error);
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (dataNotas) {
      const ctxNotas = chartNotasRef.current.getContext('2d');
      if (ctxNotas) {
        if (chartNotasInstance.current) {
          chartNotasInstance.current.destroy();
        }
        chartNotasInstance.current = new ChartJS(ctxNotas, {
          type: 'bar',
          data: {
            labels: dataNotas.map(item => item.coordenador),
            datasets: [{
              label: 'Notas',
              data: dataNotas.map(item => item.nota),
              backgroundColor: 'rgb(16, 35, 205)',
              borderColor: 'rgba(16, 35, 205, 0.2)',
            }],
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      }
    }

    if (dataRetorno) {
      const ctxRetorno = chartRetornoRef.current.getContext('2d');
      if (ctxRetorno) {
        if (chartRetornoInstance.current) {
          chartRetornoInstance.current.destroy();
        }
        chartRetornoInstance.current = new ChartJS(ctxRetorno, {
          type: 'bar',
          data: {
            labels: dataRetorno.map(item => item.coordenador),
            datasets: [
              {
                label: 'Retorno Sim',
                data: dataRetorno.map(item => item.sim),
                backgroundColor: 'rgb(16, 35, 205)', // Azul para 'Sim'
              },
              {
                label: 'Retorno Não',
                data: dataRetorno.map(item => item.nao),
                backgroundColor: 'rgb(255, 99, 132)', // Vermelho para 'Não'
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      }
    }
  }, [dataNotas, dataRetorno]);

  const filtrarDadosNotas = (dados) => {
    const filtroPorCoordenador = dados.reduce((acc, curr) => {
      if (!acc[curr.coordenador] || new Date(curr.date) > new Date(acc[curr.coordenador].date)) {
        acc[curr.coordenador] = curr;
      }
      return acc;
    }, {});
    return Object.values(filtroPorCoordenador);
  };

  const filtrarDadosRetorno = (dados) => {
    const filtroPorCoordenador = dados.reduce((acc, curr) => {
      if (!acc[curr.coordenador] || new Date(curr.date) > new Date(acc[curr.coordenador].date)) {
        acc[curr.coordenador] = curr;
      }
      return acc;
    }, {});
    const contagemRetorno = Object.values(filtroPorCoordenador).reduce((acc, curr) => {
      if (curr.retorno === 'Sim') {
        acc[curr.coordenador] = (acc[curr.coordenador] || { sim: 0, nao: 0 });
        acc[curr.coordenador].sim++;
      } else if (curr.retorno === 'Não') {
        acc[curr.coordenador] = (acc[curr.coordenador] || { sim: 0, nao: 0 });
        acc[curr.coordenador].nao++;
      }
      return acc;
    }, {});
    return Object.entries(contagemRetorno).map(([coordenador, contagem]) => ({
      coordenador,
      sim: contagem.sim || 0,
      nao: contagem.nao || 0
    }));
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro ao carregar dados: {error.message}</div>;
  }

  if ((!dataNotas || dataNotas.length === 0) && (!dataRetorno || dataRetorno.length === 0)) {
    return <div>Nenhum dado disponível.</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '48%' }}>
          <h2>Notas por Coordenador</h2>
          <canvas ref={chartNotasRef} id="myChartNotas"></canvas>
        </div>
        <div style={{ width: '48%' }}>
          <h2>Retorno por Coordenador</h2>
          <canvas ref={chartRetornoRef} id="myChartRetorno"></canvas>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
