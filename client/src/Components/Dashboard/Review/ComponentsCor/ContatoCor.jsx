import React, { useState } from 'react';
import './ContatoCor.css';
import axios from 'axios';

const ContatoCor = () => {
    const [textQuestion2, setTextQuestion2] = useState('');
    const [yesNoQuestion, setYesNoQuestion] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        if ( !yesNoQuestion || !textQuestion2) {
            setErrorMessage('Por favor, preencha todos os campos antes de enviar.');
            setTimeout(() => {
                setErrorMessage('');
            }, 4000);
            return;
        }

        setErrorMessage(''); // Clear error message if all fields are filled

        const currentDate = new Date().toISOString().split('T')[0];
        const formData = {
            date: currentDate,
            retorno: yesNoQuestion,
            comentarios: textQuestion2,
            coordenador: localStorage.getItem('coordenadorStorage'),
        };

        axios.post('http://localhost:3002/contatocor', formData)
            .then(response => {
                console.log('Dados enviados com sucesso:', response.data);
            })
            .catch(error => {
                console.error('Erro ao enviar dados:', error);
            });
    };

    return (
        <>
            <h2>Registro de Contato com Unidades</h2>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Retorno?</label>
                    <div className='inputsRetorno'>
                        <label>
                            <input
                                type="radio"
                                value="Sim"
                                checked={yesNoQuestion === 'Sim'}
                                onChange={(e) => setYesNoQuestion(e.target.value)}
                            />
                            Sim
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="Não"
                                checked={yesNoQuestion === 'Não'}
                                onChange={(e) => setYesNoQuestion(e.target.value)}
                            />
                            Não
                        </label>
                    </div>
                </div>

                <div>
                    <label htmlFor="textQuestion2">Observações</label>
                    <input
                        type="text"
                        id="textQuestion2"
                        value={textQuestion2}
                        onChange={(e) => setTextQuestion2(e.target.value)}
                    />
                </div>

                <button type="submit">Enviar</button>
            </form>
        </>
    );
};

export default ContatoCor;
