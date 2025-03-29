import React, { createContext, useState, useContext, useEffect } from 'react';
import { CONSTANTS } from '../utils/constants';

// Crear el contexto de autenticación
export const AuthContext = createContext();

// Proveedor de autenticación
const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null)

  // Cargar el estado de autenticación desde localStorage al montar el componente
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(Number(storedUserId));
      updateAvatar(storedUserId)
    } else {
      setUserId(null);
    }
  }, []);

  const login = (userId) => {
    setUserId(userId)
    localStorage.setItem('userId', userId)
    setAvatarUrl(`${CONSTANTS.BASE_URL}users/${userId?userId:0}/avatar`); // Establece la URL del avatar al iniciar sesión
  }
  const logout = () => {
    setUserId(null);
    localStorage.removeItem('userId');
    setAvatarUrl(`${CONSTANTS.BASE_URL}users/0/avatar`);
  };


  // Function to update avatar image after PUT requests
  const updateAvatar = (userId) => {
    const timestamp = new Date().getTime();
    setAvatarUrl(`${CONSTANTS.BASE_URL}users/${userId}/avatar?${timestamp}`);
  };

  return (
    <AuthContext.Provider value={{ userId, login, logout, avatarUrl, setAvatarUrl, updateAvatar }}>
      {children}
    </AuthContext.Provider>
  );
};


// Hook para acceder al contexto de autenticación
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
