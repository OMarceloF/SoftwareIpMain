import React, { useState } from "react";

const Historico = () => {
  const [tipoSelecionado, setTipoSelecionado] = useState("");

  const opcoesHistorico = [
    "Planos de Aula",
    "Aula",
    "Diário",
    "Fotos e Vídeos",
    "Propostas",
    "Inventário",
    "Contato",
    "Teachers Guide",
    "Feira"
  ];

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Histórico</h2>

      {/* Primeiro Select - Escolher Tipo de Histórico */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Visualizar:
        </label>
        <select
          className="mt-1 block w-full p-2 border rounded-md"
          value={tipoSelecionado}
          onChange={(e) => setTipoSelecionado(e.target.value)}
        >
          <option value="">Selecione...</option>
          {opcoesHistorico.map((opcao) => (
            <option key={opcao} value={opcao}>
              {opcao}
            </option>
          ))}
        </select>
      </div>

      {/* Segundo Select - Este será ajustado dinamicamente com base no tipoSelecionado */}
      {tipoSelecionado && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Selecione a data desejada:
          </label>
          <select className="mt-1 block w-full p-2 border rounded-md">
            <option value="">Selecione...</option>
            {/* Os itens aqui serão ajustados dinamicamente */}
          </select>
        </div>
      )}
    </div>
  );
};

export default Historico;
