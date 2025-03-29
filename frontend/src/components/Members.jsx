import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Text,
    Box,
    Card,
    HStack,
    VStack,
    Button,
    FormControl,
    FormLabel,
    Image
} from '@chakra-ui/react';
import { Select as MultipleSelect } from "chakra-react-select";
import { CONSTANTS } from '../utils/constants';
import { useAuth } from '../contexts/AuthContext';
import formatDate from '../utils/formatDate';

export default function Members() {
    const { userId } = useAuth()
    const [members, setMembers] = useState([]);
    const [invitations, setInvitations] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [editedInvitation, setEditedInvitation] = useState(null);
    const [searchableUsers, setSearchableUsers] = useState([]); // Estado para almacenar todos los usuarios
    const { groupId } = useParams();

    // Fetch para obtener miembros del grupo
    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            try {
                const response = await CONSTANTS.AXIOS.get(`/groups/${groupId}/members`);
                if (isMounted) {
                    setMembers(response.data.users);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [groupId]);

    // Fetch para obtener todos los usuarios inscritos en la app
    useEffect(() => {
        async function fetchAllUsers() {
            try {
                const responseUsers = await CONSTANTS.AXIOS.get(`/users`);
                const responseInvitations = await CONSTANTS.AXIOS.get(`/groups/${groupId}/invitations`)

                const fetchedUsers = responseUsers.data.users;
                const memberIds = new Set(members.map(member => member.id));

                setAllUsers(fetchedUsers)
                setSearchableUsers(fetchedUsers.filter(user => !memberIds.has(user.id)));
                setInvitations(responseInvitations.data.invitations);
            } catch (error) {
                console.error("Error fetching all users:", error);
            }
        }

        fetchAllUsers();
    }, [members]);


    const handleInviteUser = () => {
        const newInvitation = {
            inviter: userId,
            invitee: null,
            created_at: new Date().toISOString(),
            accepted_at: null,
            denied_at: null,
            group: groupId
        };

        setEditedInvitation(newInvitation);
    };


    const handleSelectChange = (selectedOption) => {
        if (selectedOption) {
            const selectedUser = searchableUsers.find(user => user.id === selectedOption.value);
            if (selectedUser) {
                setEditedInvitation(prevState => ({
                    ...prevState,
                    invitee: selectedUser.id
                }));
            }
        }
    };


    const handleInvite = async () => {

        console.log(editedInvitation)

        if (editedInvitation.invitee) {
            try {
                await CONSTANTS.AXIOS.post(`/invitations`, editedInvitation);

                setSearchableUsers(prevUsers => prevUsers.filter(user => user.id !== editedInvitation.invitee));
                invitations[0]
                    ? setInvitations(prevInvitations => [...prevInvitations, editedInvitation])
                    : setInvitations([editedInvitation])
                setEditedInvitation(null);
            } catch (error) {
                console.error("Error adding member:", error);
            }
        }
    };


    const handleCancel = () => {
        setEditedInvitation(null);
    };


    return (
        <>
            {editedInvitation ? (
                <Card bg={'white'} mb={3} p={3}>
                    <HStack spacing={3} mt={4}>
                        <FormControl mb={2}>
                            <HStack>
                                <FormLabel fontWeight={'normal'}>Username:</FormLabel>
                                {/* MultipleSelect permite buscar entre los usuarios */}
                                <MultipleSelect
                                    options={searchableUsers.map(user => ({
                                        value: user.id,
                                        label: user.username
                                    }))}
                                    placeholder="Select or search a user"
                                    onChange={handleSelectChange}
                                    isClearable // Permite limpiar el valor seleccionado
                                    isSearchable // Activa la búsqueda de usuarios
                                />
                            </HStack>
                        </FormControl>
                        <Button colorScheme="teal" onClick={handleInvite}>Invite</Button>
                        <Button colorScheme="red" onClick={handleCancel}>Cancel</Button>
                    </HStack>
                </Card>
            ) : (
                <Button onClick={handleInviteUser} colorScheme="blue" mb={5}>
                    Invite user
                </Button>
            )}

            {members.map((member) => (
                <Card key={member.id} bg={'white'} mb={3}>
                    <HStack>
                        <Image
                            boxSize='100px'
                            borderRadius='full'
                            padding={2}
                            src={`${CONSTANTS.BASE_URL}users/${member.id}/avatar`}
                            alt='User avatar image'
                        />
                        <VStack>
                            <Text alignSelf={'flex-start'} px={3} pt={3}>
                                Username: <strong>{member.username}</strong>
                            </Text>
                            <Text alignSelf={'flex-start'} px={3} pt={2} pb={3}>
                                Email: <strong>{member.email}</strong>
                            </Text>
                        </VStack>
                    </HStack>
                </Card>
            ))}
            {invitations.map((invitation) => (
                !invitation.accepted_at && (
                    <Card key={invitation.id} bg={'white'} mb={3}>
                        <VStack>
                            <HStack justifyContent={'space-between'} width={'100%'}>
                                <Text px={3} pt={3} fontSize={'medium'} color='black'>
                                    {invitation.denied_at
                                        ? 'Invitation declined'
                                        : 'Invitation'
                                    }
                                </Text>
                                <Text px={3} fontSize={'small'} color='darkgray'>
                                    {formatDate(invitation.created_at)}
                                </Text>
                            </HStack>
                            <Text alignSelf={'flex-start'} px={3} pb={3} fontSize={'medium'} color='gray'>
                                {<strong>{allUsers.find(user => user.id === invitation.invitee)?.username}</strong>}
                                {invitation.denied_at
                                    ? <> declined the invitation on {formatDate(invitation.denied_at)} </>
                                    : <> was invited by {allUsers.find(user => user.id === invitation.inviter)?.username} </>
                                }

                            </Text>
                        </VStack>
                    </Card>
                )
            ))}


        </>
    );
}
