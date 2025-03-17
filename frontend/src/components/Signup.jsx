import CardList from "./CardList";
import { useState } from "react";
import { CONSTANTS } from "../utils/constants";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    VStack,
    HStack,
    Button,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from "@chakra-ui/react";

export default function SignUp() {
    const [userInfo, setUserInfo] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        retyped_password: ''
    });
    const [failureMessage, setFailureMessage] = useState(false);
    const [newUserId, setNewUserId] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    // State for field validation
    const [errors, setErrors] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        retyped_password: ''
    });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
    
        // Update the userInfo state with the new value
        setUserInfo({
            ...userInfo,
            [id]: value
        });
    
        // Clear the error message for the field being edited
        setErrors({
            ...errors,
            [id]: ''
        });
    
        setFailureMessage(false);
    };
    
    const handlePasswordBlur = () => {
        // Validate passwords only when both fields have values
        if (userInfo.password && userInfo.retyped_password) {
            if (userInfo.password !== userInfo.retyped_password) {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    password: 'Passwords must match',
                    retyped_password: 'Passwords must match' // Ensure both fields show the error
                }));
            } else {
                // Clear the password error if they match
                setErrors(prevErrors => ({
                    ...prevErrors,
                    password: '',
                    retyped_password: '' // Clear retyped_password error
                }));
            }
        }
    };
        
    const validateFields = () => {
        let newErrors = {};
        if (!userInfo.username) newErrors.username = "Username is required.";
        if (!userInfo.first_name) newErrors.first_name = "First name is required.";
        if (!userInfo.last_name) newErrors.last_name = "Last name is required.";
        if (!userInfo.email) newErrors.email = "Email is required.";
        if (!userInfo.password) newErrors.password = "Password is required.";
        if (!userInfo.retyped_password) newErrors.retyped_password = "Please confirm your password.";
        return newErrors;
    };

    const handleSignUp = async () => {
        const fieldErrors = validateFields();
        if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
            return;
        }

        try {
            setFailureMessage(false);

            // Request server to create new user
            const response = await CONSTANTS.AXIOS.post('/users/', userInfo);
            setNewUserId(response.data.user.id)

            await CONSTANTS.AXIOS.post('login/', {
                username: userInfo.username,
                password: userInfo.password,
              });
            login(response.data.user.id);
            navigate('/');
        } catch (error) {
            setFailureMessage(true);

            // Handle API error response
            if (error.response && error.response.data) {
                const apiErrors = error.response.data;

                // Iterate over the keys in the errors state
                Object.keys(apiErrors).forEach((key) => {
                        setErrors(prevErrors => ({
                            ...prevErrors,
                            [key]: apiErrors[key] // Set the corresponding error message
                        }));
                });
            }
        }
    };

    return (
        <CardList header={"Sign Up"}>

            <VStack spacing={4} align="flex-end" w="full">
                {/* Username */}
                <FormControl isRequired isInvalid={!!errors.username}>
                    <HStack w="full">
                        <FormLabel htmlFor="username" w={150} textAlign="right">Username</FormLabel>
                        <VStack>
                            <Input
                                id="username"
                                placeholder="Enter username"
                                bgColor="white"
                                w="100%"
                                maxW={1000}
                                value={userInfo.username}
                                onChange={handleInputChange}
                            />
                            <FormErrorMessage>{errors.username}</FormErrorMessage>
                        </VStack>
                    </HStack>

                </FormControl>

                {/* First Name */}
                <FormControl isRequired isInvalid={!!errors.first_name}>
                    <HStack w="full">
                        <FormLabel htmlFor="first_name" w={150} textAlign="right">First Name</FormLabel>
                        <VStack>
                            <Input
                                id="first_name"
                                placeholder="Enter first name"
                                bgColor="white"
                                w="100%"
                                maxW={700}
                                value={userInfo.first_name}
                                onChange={handleInputChange}
                            />
                            <FormErrorMessage>{errors.first_name}</FormErrorMessage>
                        </VStack>
                    </HStack>
                </FormControl>

                {/* Last Name */}
                <FormControl isRequired isInvalid={!!errors.last_name}>
                    <HStack w="full">
                        <FormLabel htmlFor="last_name" w={150} textAlign="right">Last Name</FormLabel>
                        <VStack><Input
                            id="last_name"
                            placeholder="Enter last name"
                            bgColor="white"
                            w="100%"
                            maxW={700}
                            value={userInfo.last_name}
                            onChange={handleInputChange}
                        />
                            <FormErrorMessage>{errors.last_name}</FormErrorMessage>
                        </VStack>
                    </HStack>
                </FormControl>

                {/* Email */}
                <FormControl isRequired isInvalid={!!errors.email}>
                    <HStack w="full">
                        <FormLabel htmlFor="email" w={150} textAlign="right">Email Address</FormLabel>
                        <VStack>
                            <Input
                                id="email"
                                type="email"
                                bgColor="white"
                                placeholder="Enter email address"
                                w="100%"
                                maxW={700}
                                value={userInfo.email}
                                onChange={handleInputChange}
                            />
                            <FormErrorMessage>{errors.email}</FormErrorMessage>
                        </VStack>
                    </HStack>
                </FormControl>

                {/* Password */}
                <FormControl isRequired isInvalid={!!errors.password}>
                    <HStack w="full">
                        <FormLabel htmlFor="password" w={150} textAlign="right">Password</FormLabel>
                        <VStack>
                            <Input
                                id="password"
                                type="password"
                                bgColor="white"
                                placeholder="Enter password"
                                w="100%"
                                maxW={700}
                                value={userInfo.password}
                                onChange={handleInputChange}
                                onBlur={handlePasswordBlur}
                                />
                            <FormErrorMessage>{errors.password}</FormErrorMessage>
                        </VStack>
                    </HStack>

                    <HStack w="full" mt={4}>
                        <FormLabel htmlFor="retyped_password" w={150} textAlign="right">Retype password</FormLabel>
                        <VStack>
                            <Input
                                id="retyped_password"
                                type="password"
                                bgColor="white"
                                placeholder="Retype password"
                                w="100%"
                                maxW={700}
                                value={userInfo.retyped_password}
                                onChange={handleInputChange}
                                onBlur={handlePasswordBlur}
                                />
                            <FormErrorMessage>{errors.retyped_password}</FormErrorMessage>
                        </VStack>
                    </HStack>
                </FormControl>

                {failureMessage && (
                    <Alert status="error">
                        <AlertIcon />
                        <AlertTitle>Error!</AlertTitle>
                        <AlertDescription>Failed to create user.</AlertDescription>
                    </Alert>
                )}


                {/* Buttons */}
                <HStack spacing={4} w="full" justify="flex-end">
                    <Button colorScheme="orange" onClick={handleSignUp}>
                        Sign Up
                    </Button>
                    <Button colorScheme="gray" onClick={() => setUserInfo({
                        username: '',
                        first_name: '',
                        last_name: '',
                        email: '',
                        password: '',
                        retyped_password: '' // Reset retyped_password as well
                    })}>
                        Reset
                    </Button>
                </HStack>
            </VStack>
        </CardList>
    );
}