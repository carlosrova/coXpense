import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  Heading, 
  Text, 
  Stack, 
  useToast 
} from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CONSTANTS } from '../utils/constants';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { userId, login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirigir si el usuario ya está autenticado
  // useEffect(() => {
  //   console.log("Login useEffect userId = ", userId)
  //   if (userId) {
  //     navigate('/groups');
  //   }
  // }, [userId, navigate]);

  // Obtener la página original a la que el usuario intentaba acceder
  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (e) => {
    console.log("Login handleLogin")
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Login handleLogin try")
      const response = await CONSTANTS.AXIOS.post('login/', {
        username: username,
        password: password,
      });
      console.log("Login handleLogin response after post", response)
      // Mostrar mensaje de éxito
      toast({
        title: 'Login successful',
        description: `Welcome back, ${username}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Ejecutar la función de login
      login(response.data.user_id);

      setLoading(false);

      // Redirigir al usuario a la página solicitada originalmente
      navigate(from, { replace: true });
      
    } catch (error) {
      // Mostrar mensaje de error en caso de fallo
      toast({
        title: 'Error',
        description: 'Login failed. Please check your credentials.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bg="gray.50"
    >
      <Box
        bg="white"
        p={6}
        rounded="md"
        boxShadow="lg"
        w={{ base: '90%', md: '400px' }}
      >
        <Heading mb={6} textAlign="center" size="lg">
          Login
        </Heading>
        <form onSubmit={handleLogin}>
          <Stack spacing={4}>
            <FormControl id="username" isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
            </FormControl>

            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              isLoading={loading}
              loadingText="Logging in..."
            >
              Login
            </Button>
          </Stack>
        </form>
        <Text mt={4} textAlign="center">
          Don't have an account? <a href="/signup">Sign up</a>
        </Text>
      </Box>
    </Box>
  );
};

export default Login;
