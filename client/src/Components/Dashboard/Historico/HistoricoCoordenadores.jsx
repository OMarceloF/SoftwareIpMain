import React, { useState, useEffect } from "react";
import axios from "axios";

const HistoricoCoordenadores = () => {
  const [tipoSelecionado, setTipoSelecionado] = useState("");
  const [unidades, setUnidades] = useState([]);
  const [coordenador, setCoordenador] = useState("");
  const [unidadeSelecionada, setUnidadeSelecionada] = useState("");
  const [mesSelecionado, setMesSelecionado] = useState("");
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [carregar, setCarregar] = useState(false);

  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const opcoesHistorico = [
    { label: "Planos de Aula", tabela: "planos", colunas: ["regente", "nota", "comentarios"] },
    { label: "Aula", tabela: "aula", colunas: ["regente", "nota", "comentarios"] },
    { label: "Diário", tabela: "diarios", colunas: ["regente", "nota", "comentarios"] },
    { label: "Fotos e Vídeos", tabela: "fotosevideos", colunas: ["nota", "comentarios"] },
    { label: "Propostas", tabela: "propostas", colunas: ["regente", "comentarios"] },
    { label: "Inventário", tabela: "inventario", colunas: ["regente", "comentarios", "quem", "resolvido"] },
    { label: "Contato", tabela: "contato", colunas: ["retorno", "comentarios"] },
    { label: "Teachers Guide", tabela: "guide", colunas: ["turma", "conformidade", "comentarios"] },
    { label: "Feira", tabela: "feira", colunas: ["cronograma", "estrutural", "apresentacao", "comentarios"] },
  ];

  useEffect(() => {
    const coordenadorNome = localStorage.getItem("coordenadorStorage");
    if (coordenadorNome) {
      setCoordenador(coordenadorNome);
      axios.get("https://softwareipmain-production.up.railway.app/unidades")
        .then(response => {
          const unidadesFiltradas = response.data.filter(
            unidade => unidade.coordenador === coordenadorNome
          );
          setUnidades(unidadesFiltradas);
        })
        .catch(error => console.error("Erro ao buscar unidades:", error));
    }
  }, []);

  useEffect(() => {
    if (!tipoSelecionado || !unidadeSelecionada) {
      setAvaliacoes([]);
      return;
    }

    const tabela = opcoesHistorico.find(opcao => opcao.label === tipoSelecionado)?.tabela;
    if (!tabela) return;

    axios.get(`https://softwareipmain-production.up.railway.app/${tabela}/${unidadeSelecionada}`)
      .then(response => {
        setAvaliacoes(response.data);
      })
      .catch(error => console.error("Erro ao buscar avaliações:", error));
  }, [tipoSelecionado, unidadeSelecionada]);

  const resetarDados = () => {
    setCarregar(false);
    setMesSelecionado("");
  };

  const avaliacoesFiltradas = avaliacoes.filter(avaliacao => {
    if (!mesSelecionado) return false;
    const data = new Date(avaliacao.date);
    return data.getMonth() === meses.indexOf(mesSelecionado);
  });

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Histórico</h2>

      {/* Primeiro Select - Escolher Tipo de Histórico */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Visualizar:</label>
        <select
          className="mt-1 block w-full p-2 border rounded-md"
          value={tipoSelecionado}
          onChange={(e) => {
            setTipoSelecionado(e.target.value);
            resetarDados();
          }}
        >
          <option value="">Selecione...</option>
          {opcoesHistorico.map(opcao => (
            <option key={opcao.tabela} value={opcao.label}>{opcao.label}</option>
          ))}
        </select>
      </div>

      {/* Segundo Select - Lista de Unidades do Coordenador Logado */}
      {tipoSelecionado && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Selecione a unidade:</label>
          <select
            className="mt-1 block w-full p-2 border rounded-md"
            value={unidadeSelecionada}
            onChange={(e) => {
              setUnidadeSelecionada(e.target.value);
              resetarDados();
            }}
          >
            <option value="">Selecione...</option>
            {unidades.map(unidade => (
              <option key={unidade.cidade} value={unidade.cidade}>{unidade.cidade}</option>
            ))}
          </select>
        </div>
      )}

      {/* Terceiro Select - Escolher Mês */}
      {unidadeSelecionada && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Selecione o mês:</label>
          <select
            className="mt-1 block w-full p-2 border rounded-md"
            value={mesSelecionado}
            onChange={(e) => setMesSelecionado(e.target.value)}
          >
            <option value="">Selecione...</option>
            {meses.map((mes, index) => (
              <option key={index} value={mes}>{mes}</option>
            ))}
          </select>
        </div>
      )}

      {/* Exibir as avaliações do mês selecionado */}
      {mesSelecionado && avaliacoesFiltradas.length > 0 && (
        <div className="mt-4 p-4 border rounded-md bg-gray-100">
          <h3 className="text-lg font-semibold mb-2">Avaliações de {mesSelecionado}</h3>
          {avaliacoesFiltradas.map((avaliacao, index) => (
            <div key={index} className="p-2 border-b last:border-0">
              <p><strong>Data:</strong> {new Date(avaliacao.date).toLocaleDateString("pt-BR")}</p>
              <p><strong>Nota:</strong> {avaliacao.nota}</p>
              {avaliacao.regente && <p><strong>Regente:</strong> {avaliacao.regente}</p>}
              {avaliacao.comentarios && <p><strong>Comentários:</strong> {avaliacao.comentarios}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoricoCoordenadores;
