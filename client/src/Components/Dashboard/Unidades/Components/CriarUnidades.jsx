import React, { useState } from 'react';
import axios from 'axios';
import './CriarUnidades.css';

const Aulas = () => {
    const [textQuestion1, setTextQuestion1] = useState('');
    const [textQuestion2, setTextQuestion2] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        // Verificar se todos os campos estão preenchidos
        if (!textQuestion1 || !textQuestion2) {
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
            coordenador: textQuestion2,
        };

        axios.post('http://localhost:3002/unidades', formData)
            .then(response => {
                console.log('Dados enviados com sucesso:', response.data);
                setSuccessMessage('Dados enviados com sucesso!');
                setError('');
                setIsSubmitting(false);
                // Limpar campos após envio bem-sucedido
                setTextQuestion1('');
                setTextQuestion2('');
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
                    <label htmlFor="textQuestion2">Coordenador</label>
                    <input
                        type="text"
                        id="textQuestion2"
                        value={textQuestion2}
                        onChange={(e) => setTextQuestion2(e.target.value)}
                    />
                </div>

                <button type="submit" disabled={isSubmitting}>Enviar
                </button>
            </form>
        </>
    );
};

export default Aulas;
