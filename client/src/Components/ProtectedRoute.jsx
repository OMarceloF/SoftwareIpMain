import React from 'react';
import { Route, Navigate } from 'react-router-dom';

// Função para verificar autenticação
const isAuthenticated = () => {
    return localStorage.getItem('isAuthenticated') === 'true';
};

// Função para obter o papel do usuário
const getUserRole = () => {
    return localStorage.getItem('role');
};

// Componente ProtectedRoute
const ProtectedRoute = ({ element: Element, allowedRoles, ...rest }) => {
    const isAuth = isAuthenticated();
    const userRole = getUserRole();

    console.log('isAuth:', isAuth);
    console.log('userRole:', userRole);

    if (!isAuth) {
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Element {...rest} />;
};

export default ProtectedRoute;
