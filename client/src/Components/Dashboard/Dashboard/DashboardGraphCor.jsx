import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

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
      .then(response => {
        setCoordenadores(response.data);
        if (response.data.length === 1) {
          setCoordenador(response.data[0].username);
        }
      })
      .catch(error => console.error("Erro ao buscar coordenadores:", error));
    
    axios.get("https://softwareipmain-production.up.railway.app/coordenadores")
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
        .then(response => {
          const dadosFiltrados = filtrarPorMes(response.data, mes);
          console.log("Dados recebidos:", response.data); // Verifica os dados recebidos
          setDados({ aulascor: dadosFiltrados }); // Ajuste para armazenar corretamente os dados
        })
        .catch(error => console.error("Erro ao buscar dados:", error));
      axios.get(`https://softwareipmain-production.up.railway.app/contatocor/${encodeURIComponent(coordenador)}`)
        .then(response => {
          const dadosFiltrados = filtrarPorMes(response.data, mes);
          setDados(prev => ({ ...prev, contatocor: dadosFiltrados }));
        })
        .catch(error => console.error("Erro ao buscar dados de contatos:", error));
      axios.get(`https://softwareipmain-production.up.railway.app/diarioscor/${encodeURIComponent(coordenador)}`)
        .then(response => {
          const dadosFiltrados = filtrarPorMes(response.data, mes);
          setDados(prev => ({ ...prev, diarioscor: dadosFiltrados }));
        })
        .catch(error => console.error("Erro ao buscar dados de diários:", error));

      axios.get(`https://softwareipmain-production.up.railway.app/fotosevideoscor/${encodeURIComponent(coordenador)}`)
        .then(response => {
          const dadosFiltrados = filtrarPorMes(response.data, mes);
          setDados(prev => ({ ...prev, fotosevideoscor: dadosFiltrados }));
        })
        .catch(error => console.error("Erro ao buscar dados de fotos e vídeos:", error));

      axios.get(`https://softwareipmain-production.up.railway.app/feiracor/${encodeURIComponent(coordenador)}`)
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
      )}
    </div>
  );
};

export default DashboardGraphCor;
