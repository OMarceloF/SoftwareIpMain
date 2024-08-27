import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Registro dos componentes do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [dataNotas, setDataNotas] = useState(null);
  const [dataRetorno, setDataRetorno] = useState(null);
  const [dataDiarios, setDataDiarios] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('Janeiro'); // Estado para o mês selecionado
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const chartNotasRef = useRef(null);
  const chartRetornoRef = useRef(null);
  const chartDiariosRef = useRef(null);
  const chartNotasInstance = useRef(null);
  const chartRetornoInstance = useRef(null);
  const chartDiariosInstance = useRef(null);

  useEffect(() => {
    const monthMapping = {
      'Janeiro': 1,
      'Fevereiro': 2,
      'Março': 3,
      'Abril': 4,
      'Maio': 5,
      'Junho': 6,
      'Julho': 7,
      'Agosto': 8,
      'Setembro': 9,
      'Outubro': 10,
      'Novembro': 11,
      'Dezembro': 12
    };

    const monthNumber = monthMapping[selectedMonth];

    // Buscar dados para o gráfico de notas
    axios.get(`http://localhost:3002/aulacor/notas-por-coordenador?month=${monthNumber}`)
      .then(response => {
        console.log("Dados de notas recebidos da API:", response.data); 
        const filteredDataNotas = filtrarDadosNotas(response.data);
        setDataNotas(filteredDataNotas);
      })
      .catch(error => {
        console.error("Erro ao buscar dados de notas:", error);
        setError(error);
      });

    // Buscar dados para o gráfico de retorno
    axios.get(`http://localhost:3002/contatocor/retornos-por-coordenador?month=${monthNumber}`)
      .then(response => {
        console.log("Dados de retorno recebidos da API:", response.data); 
        const filteredDataRetorno = filtrarDadosRetorno(response.data);
        setDataRetorno(filteredDataRetorno);
      })
      .catch(error => {
        console.error("Erro ao buscar dados de retorno:", error);
        setError(error);
      });

    // Buscar dados para o gráfico de diários
    axios.get(`http://localhost:3002/diarioscor/notas-por-coordenador?month=${monthNumber}`)
      .then(response => {
        console.log("Dados de diários recebidos da API:", response.data); 
        const filteredDataDiarios = filtrarDadosDiarios(response.data);
        setDataDiarios(filteredDataDiarios);
      })
      .catch(error => {
        console.error("Erro ao buscar dados de diários:", error);
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedMonth]);

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
                backgroundColor: 'rgb(16, 35, 205)', 
              },
              {
                label: 'Retorno Não',
                data: dataRetorno.map(item => item.nao),
                backgroundColor: 'rgb(255, 99, 132)', 
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
              backgroundColor: 'rgb(75, 192, 192)',
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

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    console.log("Mês selecionado:", event.target.value);
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
        <label htmlFor="month-select">Selecione o Mês: </label>
        <select id="month-select" value={selectedMonth} onChange={handleMonthChange}>
          <option value="Janeiro">Janeiro</option>
          <option value="Fevereiro">Fevereiro</option>
          <option value="Março">Março</option>
          <option value="Abril">Abril</option>
          <option value="Maio">Maio</option>
          <option value="Junho">Junho</option>
          <option value="Julho">Julho</option>
          <option value="Agosto">Agosto</option>
          <option value="Setembro">Setembro</option>
          <option value="Outubro">Outubro</option>
          <option value="Novembro">Novembro</option>
          <option value="Dezembro">Dezembro</option>
        </select>
      </div>

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
