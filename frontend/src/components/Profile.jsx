import CardList from "./CardList";
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from "react";
import { CONSTANTS } from "../utils/constants";
import {
    FormControl,
    FormLabel,
    Input,
    VStack,
    HStack,
    Button,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Image
} from "@chakra-ui/react";

export default function Profile() {

    const { userId, avatarUrl, updateAvatar } = useAuth();
    const [userInfo, setUserInfo] = useState(null);
    const [editedUserInfo, setEditedUserInfo] = useState({});
    const [editedAvatarImage, setEditedAvatarImage] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false)
    const [failureMessage, setFailureMessage] = useState(false)



    useEffect(() => {
        let isMounted = true;

        const fetchUserInfo = async () => {
            if (userId !== null) { // To avoid errors when invoked on mounting this component
                try {
                    if (isMounted) {
                        const response = await CONSTANTS.AXIOS.get(`users/${userId}`);
                        const userData = response.data.user;
                        const { password, links, ...userWithoutPassword } = userData;
                        setUserInfo(userData);
                        setEditedUserInfo(userWithoutPassword);
                    }
                } catch (error) {
                    if (isMounted) {
                        console.error('Error fetching the data:', error);
                    }
                }
            }
        };

        fetchUserInfo();

        return () => { // Cleanup function will be executed on unmount
            isMounted = false;
        };
    }, [userId]);


    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setEditedUserInfo({
            ...editedUserInfo,
            [id]: value
        });
        setSuccessMessage(false)
        setFailureMessage(false)
    };

    const handleAvatarImageChange = (e) => {
        setEditedAvatarImage(e.target.files[0]);
    }

    const handleSaveUserInfo = async () => {
        try {
            console.log(editedUserInfo)
            await CONSTANTS.AXIOS.put(`/users/${userId}`, {"user":editedUserInfo})
            console.log('Profile.jsx editedUserInfo = ', editedUserInfo)
            if (editedAvatarImage) {
                const newUserProfile = {
                    'user': userId,
                    'avatar': editedAvatarImage
                }
                if (editedUserInfo.userprofile) {
                    await CONSTANTS.AXIOS.put(`/userprofiles/${editedUserInfo.userprofile}`, newUserProfile, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    })
                } else {
                    await CONSTANTS.AXIOS.post(`/userprofiles/`, newUserProfile, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    })
                }
                updateAvatar(userId)
            }
            setUserInfo(editedUserInfo)
            setSuccessMessage(true)
        } catch {
            console.error('Error changing profile data:', error)
            setFailureMessage(true)
        }
    }

    return (
        <CardList header={"Profile"}>
            <FormControl>
                <VStack spacing={4} align="flex-end" w="full">
                    
                    {/* Username */}
                    <HStack w="full">
                        <FormLabel htmlFor="username" w="150px" textAlign="right">Username</FormLabel>
                        <Input
                            id="username"
                            placeholder="Enter username"
                            bgColor="white"
                            w="100%"
                            maxW={1000}
                            value={editedUserInfo.username || ''}
                            onChange={handleInputChange}
                        />
                    </HStack>

                    {/* Name */}
                    <HStack w="full">
                        <FormLabel htmlFor="name" w="150px" textAlign="right">Name</FormLabel>
                        <Input
                            id="first_name"
                            placeholder="Enter name"
                            bgColor="white"
                            w="100%"
                            maxW={700}
                            value={editedUserInfo.first_name || ''}
                            onChange={handleInputChange}
                        />
                    </HStack>

                    {/* Surname */}
                    <HStack w="full">
                        <FormLabel htmlFor="surname" w="150px" textAlign="right">Surname</FormLabel>
                        <Input
                            id="last_name"
                            placeholder="Enter surname"
                            bgColor="white"
                            w="100%"
                            maxW={700}
                            value={editedUserInfo.last_name || ''}
                            onChange={handleInputChange}
                        />
                    </HStack>

                    {/* Email */}
                    <HStack w="full">
                        <FormLabel htmlFor="email" w="150px" textAlign="right">Email Address</FormLabel>
                        <Input
                            id="email"
                            type="email"
                            bgColor="white"
                            placeholder="Enter email address"
                            w="100%"
                            maxW={700}
                            value={editedUserInfo.email || ''}
                            onChange={handleInputChange}
                        />
                    </HStack>

                    {/* Profile Image */}
                    <HStack w="full">
                        <Image
                            boxSize='100px'
                            borderRadius='full'
                            padding={2}
                            src={editedAvatarImage ? URL.createObjectURL(editedAvatarImage) : avatarUrl}
                            alt='User avatar image'
                        />
                        <FormLabel htmlFor="avatarImage" w="150px" textAlign="right">Profile Image</FormLabel>
                        <Input
                            id="avatarImage"
                            type="file"
                            accept="image/*"
                            bgColor="white"
                            w="100%"
                            maxW={700}
                            onChange={handleAvatarImageChange}
                        />
                    </HStack>

                    {successMessage && (
                        <Alert status="success">
                            <AlertIcon />
                            <AlertTitle>Success!</AlertTitle>
                            <AlertDescription>Your profile information has been updated successfully.</AlertDescription>
                        </Alert>
                    )}
                    {failureMessage && (
                        <Alert status="error">
                            <AlertIcon />
                            <AlertTitle>Error!</AlertTitle>
                            <AlertDescription>Your profile information has not been updated.</AlertDescription>
                        </Alert>
                    )}

                    {/* Botones */}
                    <HStack spacing={4} w="full" justify="flex-end">
                        <Button colorScheme="orange" onClick={handleSaveUserInfo}>
                            Save profile information
                        </Button>
                        <Button colorScheme="gray" onClick={() => setEditedUserInfo(userInfo)}>
                            Reset
                        </Button>
                    </HStack>
                </VStack>
            </FormControl>
        </CardList>
    );
}
