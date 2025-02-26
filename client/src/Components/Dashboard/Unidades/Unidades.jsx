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
    const [userRole, setUserRole] = useState('');
    const [editEndereco, setEditEndereco] = useState('');
    const [editTelefone, setEditTelefone] = useState('');
    const [editCoordenador, setEditCoordenador] = useState('');
    const [editNomeDirecao, setEditNomeDirecao] = useState('');

    const location = useLocation();

    const handleSave = () => {
        axios.put(`https://softwareipmain-production.up.railway.app/unidades/${selectedUnidade.cidade}`, {
            endereco: editEndereco,
            telefone: editTelefone,
            coordenador: editCoordenador,
            nomedir: editNomeDirecao,
        })
        .then(response => {
            setUnidades(prevUnidades =>
                prevUnidades.map(unidade =>
                    unidade.cidade === selectedUnidade.cidade
                        ? { ...unidade, endereco: editEndereco, telefone: editTelefone, coordenador: editCoordenador, nomedir: editNomeDirecao }
                        : unidade
                )
            );
            closeModal();
        })
        .catch(error => {
            console.error('Erro ao atualizar a unidade:', error);
        });
    };

    useEffect(() => {
        const email = localStorage.getItem('emailStorage');
        const role = localStorage.getItem('role');

        if (role) {
            setUserRole(role);
        } else {
            setUserRole('');
        }

        axios.get('https://softwareipmain-production.up.railway.app/unidades')
            .then(response => {
                const sortedUnidades = response.data.sort((a, b) => a.cidade.localeCompare(b.cidade));
                setUnidades(sortedUnidades);
            })
            .catch(error => {
                console.error('Erro ao buscar dados:', error);
            });

        if (email) {
            axios.get(`https://softwareipmain-production.up.railway.app/getUsername/${email}`)
                .then(response => {
                    setName(response.data.name);
                    localStorage.setItem('nameStorage', response.data.name);
                })
                .catch(error => {
                    console.error('Erro ao buscar o name:', error);
                });
        }
    }, []);

    const filteredUnidades = unidades.filter(unidade => {
        const matchBySearchTerm = unidade.cidade.toLowerCase().startsWith(searchTerm.toLowerCase());
        const matchByCoordenador = userRole === 'admin' || unidade.coordenador === name;
        return matchBySearchTerm && matchByCoordenador;
    });

    const openModal = (content, unidade) => {
        setModalContent(content);
        setSelectedUnidade(unidade);
        setEditEndereco(unidade.endereco);
        setEditTelefone(unidade.telefone);
        setEditCoordenador(unidade.coordenador);
        setEditNomeDirecao(unidade.nomedir || '');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalContent('');
        setSelectedUnidade(null);
    };

    const renderCreateUnitButton = () => {
        return userRole === 'admin' ? (
            <Link to="/dashboard/unidades/criarunidade">
                <button>Adicionar Nova Unidade</button>
            </Link>
        ) : null;
    }

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
                    {renderCreateUnitButton()}

                    {isModalOpen && (
                        <div className="modal-overlay" onClick={closeModal}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                {modalContent === 'informações' && selectedUnidade && (
                                    <>
                                        <h2>{selectedUnidade.cidade}</h2>
                                        <div className="info-item">
                                            <span>Endereço: </span>
                                            <input
                                                type="text"
                                                value={editEndereco}
                                                onChange={(e) => setEditEndereco(e.target.value)}
                                            />
                                        </div>
                                        <div className="info-item">
                                            <span>Telefone de Contato: </span>
                                            <input
                                                type="text"
                                                value={editTelefone}
                                                onChange={(e) => setEditTelefone(e.target.value)}
                                            />
                                        </div>
                                        <div className="info-item">
                                            <span>Coordenador: </span>
                                            <input
                                                type="text"
                                                value={editCoordenador}
                                                onChange={(e) => setEditCoordenador(e.target.value)}
                                            />
                                        </div>
                                        <div className="info-item">
                                            <span>Nome da Direção: </span>
                                            <input
                                                type="text"
                                                value={editNomeDirecao}
                                                onChange={(e) => setEditNomeDirecao(e.target.value)}
                                            />
                                        </div>
                                        <button onClick={handleSave}>Salvar</button>
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
