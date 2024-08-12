import './Unidades.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, Outlet, useLocation } from 'react-router-dom';

const Unidades = () => {
    const [unidades, setUnidades] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [selectedUnidade, setSelectedUnidade] = useState(null);
    const [name, setName] = useState('');

    const location = useLocation();

    useEffect(() => {
        const email = localStorage.getItem('emailStorage');

        axios.get('http://localhost:3002/unidades')
            .then(response => {
                const sortedUnidades = response.data.sort((a, b) => a.cidade.localeCompare(b.cidade));
                setUnidades(sortedUnidades);
            })
            .catch(error => {
                console.error('Erro ao buscar dados:', error);
            });

        if (email) {
            axios.get(`http://localhost:3002/getUsername/${email}`)
                .then(response => {
                    setName(response.data.name);
                    localStorage.setItem('nameStorage', response.data.name);
                })
                .catch(error => {
                    console.error('Erro ao buscar o name:', error);
                });
        }
    }, []);

    // Filtro para mostrar apenas as unidades que possuem o mesmo coordenador que o usuário logado
    const filteredUnidades = unidades.filter(unidade =>
        unidade.cidade.toLowerCase().startsWith(searchTerm.toLowerCase()) &&
        unidade.coordenador === name // Filtra as unidades pelo coordenador
    );

    const openModal = (content, unidade) => {
        setModalContent(content);
        setSelectedUnidade(unidade);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalContent('');
        setSelectedUnidade(null);
    };

    return (
        <>
            {location.pathname === "/dashboard/unidades" ? (
                <>
                    <h2>Unidades</h2>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Buscar unidade..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="search-icon">🔍</span>
                    </div>
                    <div className="list-container">
                        {filteredUnidades.map((unidade, index) => (
                            <div key={index} className="list-item">
                                <span>{unidade.cidade}</span>
                                <div>
                                    <button
                                        className="info-button"
                                        onClick={() => openModal('informações', unidade)}
                                    >
                                        Informações
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Link to={"/dashboard/unidades/criarunidade"}><button>Adicionar Nova Unidade</button></Link>

                    {/* Modal */}
                    {isModalOpen && (
                        <div className="modal-overlay" onClick={closeModal}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                {modalContent === 'informações' && selectedUnidade && (
                                    <>
                                        <h2>{selectedUnidade.cidade}</h2>
                                        <div className="info-item">
                                            <span>Endereço: {selectedUnidade.endereco}</span>
                                            <span className="edit-icon">✏️</span>
                                        </div>
                                        <div className="info-item">
                                            <span>Telefone de Contato: {selectedUnidade.telefone}</span>
                                            <span className="edit-icon">✏️</span>
                                        </div>
                                        <div className="info-item">
                                            <span>Coordenador: {selectedUnidade.coordenador}</span>
                                            <span className="edit-icon">✏️</span>
                                        </div>
                                    </>
                                )}
                                <button onClick={closeModal}>Fechar</button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <Outlet />
            )}
        </>
    );
};

export default Unidades;
