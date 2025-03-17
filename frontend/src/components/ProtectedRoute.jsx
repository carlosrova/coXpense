import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
  const { userId } = useAuth();
  const location = useLocation();

  // Mostrar un indicador de carga mientras el estado de autenticación es null
  // if (userId === null) {
  //   return <div>Loading...</div>;
  // }
  const storedUserId = localStorage.getItem('userId');

  // Si el usuario no está autenticado, redirigir al login y pasar la ubicación actual
  if (!storedUserId) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  // Si está autenticado, renderizar el componente hijo
  return children;
};

export default ProtectedRoute;
