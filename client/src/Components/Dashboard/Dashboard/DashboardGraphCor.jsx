import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Registro dos componentes do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [dataNotas, setDataNotas] = useState(null); // Dados para o gráfico de notas
  const [dataRetorno, setDataRetorno] = useState(null); // Dados para o gráfico de retorno
  const [dataDiarios, setDataDiarios] = useState(null); // Dados para o gráfico de diários
  const [error, setError] = useState(null); // Estado para armazenar erros
  const [loading, setLoading] = useState(true); // Estado para mostrar carregamento
  const chartNotasRef = useRef(null); // Referência para o canvas do gráfico de notas
  const chartRetornoRef = useRef(null); // Referência para o canvas do gráfico de retorno
  const chartDiariosRef = useRef(null); // Referência para o canvas do gráfico de diários
  const chartNotasInstance = useRef(null); // Referência para a instância do gráfico de notas
  const chartRetornoInstance = useRef(null); // Referência para a instância do gráfico de retorno
  const chartDiariosInstance = useRef(null); // Referência para a instância do gráfico de diários

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
      });

    // Buscar dados para o gráfico de diários
    axios.get('http://localhost:3002/diarioscor/notas-por-coordenador')
      .then(response => {
        console.log("Dados de diários recebidos da API:", response.data); // Log para verificar os dados recebidos
        const filteredDataDiarios = filtrarDadosDiarios(response.data); // Filtra os dados de diários
        setDataDiarios(filteredDataDiarios);
      })
      .catch(error => {
        console.error("Erro ao buscar dados de diários:", error);
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (dataNotas) {
      const ctxNotas = chartNotasRef.current?.getContext('2d');
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
  }, [dataNotas]);

  useEffect(() => {
    if (dataRetorno) {
      const ctxRetorno = chartRetornoRef.current?.getContext('2d');
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
  }, [dataRetorno]);

  useEffect(() => {
    if (dataDiarios) {
      const ctxDiarios = chartDiariosRef.current?.getContext('2d');
      if (ctxDiarios) {
        if (chartDiariosInstance.current) {
          chartDiariosInstance.current.destroy();
        }
        chartDiariosInstance.current = new ChartJS(ctxDiarios, {
          type: 'bar',
          data: {
            labels: dataDiarios.map(item => item.coordenador),
            datasets: [{
              label: 'Notas Diários',
              data: dataDiarios.map(item => item.nota),
              backgroundColor: 'rgb(75, 192, 192)', // Cor para notas diárias
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
  }, [dataDiarios]);

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
    return Object.keys(contagemRetorno).map(key => ({ coordenador: key, ...contagemRetorno[key] }));
  };

  const filtrarDadosDiarios = (dados) => {
    const filtroPorCoordenador = dados.reduce((acc, curr) => {
      if (!acc[curr.coordenador] || new Date(curr.date) > new Date(acc[curr.coordenador].date)) {
        acc[curr.coordenador] = curr;
      }
      return acc;
    }, {});
    return Object.values(filtroPorCoordenador);
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro: {error.message}</div>;
  }

  return (
    <div>
      <div>
        <h2>Gráfico de Notas</h2>
        <canvas ref={chartNotasRef} />
      </div>
      <div>
        <h2>Gráfico de Retorno</h2>
        <canvas ref={chartRetornoRef} />
      </div>
      <div>
        <h2>Gráfico de Diários</h2>
        <canvas ref={chartDiariosRef} />
      </div>
    </div>
  );
};

export default Dashboard;
