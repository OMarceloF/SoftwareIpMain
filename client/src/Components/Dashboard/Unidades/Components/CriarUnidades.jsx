import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CriarUnidades.css';

const Aulas = () => {
    const [textQuestion1, setTextQuestion1] = useState('');
    const [coordenadores, setCoordenadores] = useState([]);
    const [coordenadorSelecionado, setCoordenadorSelecionado] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Buscar os coordenadores no backend ao carregar a página
    useEffect(() => {
        axios.get('https://softwareipmain-production.up.railway.app/coordenadores')
            .then(response => {
                setCoordenadores(response.data);
            })
            .catch(error => {
                console.error('Erro ao buscar coordenadores:', error);
            });
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        // Verificar se todos os campos estão preenchidos
        if (!textQuestion1 || !coordenadorSelecionado) {
            setError('Por favor, preencha todos os campos.');
            setSuccessMessage('');
            setIsSubmitting(false);
            setTimeout(() => {
                setError('');
            }, 4000);
            return;
        }

        setIsSubmitting(true);
        const formData = {
            cidade: textQuestion1,
            coordenador: coordenadorSelecionado,
        };

        axios.post('https://softwareipmain-production.up.railway.app/unidades', formData)
            .then(response => {
                console.log('Dados enviados com sucesso:', response.data);
                setSuccessMessage('Dados enviados com sucesso!');
                setError('');
                setIsSubmitting(false);
                // Limpar campos após envio bem-sucedido
                setTextQuestion1('');
                setCoordenadorSelecionado('');
                // Remover mensagem de sucesso após 4 segundos
                setTimeout(() => {
                    setSuccessMessage('');
                }, 4000);
            })
            .catch(error => {
                console.error('Erro ao enviar dados:', error);
                setSuccessMessage('');
                setIsSubmitting(false);
            });
    };

    return (
        <>
            <h2>Adicione uma unidade</h2>
            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success">{successMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="textQuestion1">Cidade</label>
                    <input
                        type="text"
                        id="textQuestion1"
                        value={textQuestion1}
                        onChange={(e) => setTextQuestion1(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="coordenador">Coordenador</label>
                    <select
                        id="coordenador"
                        value={coordenadorSelecionado}
                        onChange={(e) => setCoordenadorSelecionado(e.target.value)}
                    >
                        <option value="">Selecione um coordenador...</option>
                        {coordenadores.map((coord, index) => (
                            <option key={index} value={coord.username}>
                                {coord.username}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" disabled={isSubmitting}>Enviar</button>
            </form>
        </>
    );
};

export default Aulas;
