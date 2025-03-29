import React, { useState, useEffect } from 'react';
import {
  Text,
  Card,
  VStack,
  HStack,
  Button,
  useColorModeValue,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react'
import { CONSTANTS } from '../utils/constants';
import formatDate from '../utils/formatDate';
import CardList from './CardList';
import { useAuth } from '../contexts/AuthContext';

export default function Groups() {
  const { userId } = useAuth();
  const [groups, setGroups] = useState([]);
  const [editingGroupId, setEditingGroupId] = useState(null); // Estado centralizado para el grupo en edición
  const [invitations, setInvitations] = useState([]);
  const [members, setMembers] = useState([]);

  const cardBgColor = useColorModeValue('white', 'gray.800');
  const btnBgColor = useColorModeValue('orange.400', 'orange.100');

  async function fetchData() {
    try {
      const response = await CONSTANTS.AXIOS.get('groups/?include[]=invitations.*&include[]=members.*');
      setGroups(response.data.groups);
      setInvitations(response.data.invitations);
      setMembers(response.data.users);
    } catch (error) {
      console.error('Error fetching the data:', error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateGroupClick = () => {
    const newGroup = {
      id: 0,
      name: '',
      created_at: new Date().toISOString(),
      members: [userId]
    };

    setGroups(prevGroups => [newGroup, ...prevGroups]);
    setEditingGroupId(0); // Establecer que el grupo nuevo está en edición
  };

  const handleCancelEdit = () => {
    setEditingGroupId(null); // Cancelar la edición del grupo
    setGroups(prevGroups => prevGroups.filter(group => group.id !== 0)); // Eliminar el grupo nuevo si se cancela
  };

  return (
    <CardList header={"Groups"}>
      <Button onClick={handleCreateGroupClick} colorScheme="blue" mb={5} isDisabled={editingGroupId !== null}>
        Create group
      </Button>
      {groups
        ?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .map(group => (
          group.members.includes(userId) ? (
            <MemberGroupCard
              key={group.id}
              group={group}
              isEditing={editingGroupId === group.id}
              onEditClick={() => setEditingGroupId(group.id)}
              onCancelEdit={handleCancelEdit}
            />
          ) : (
            <InvitedGroupCard
              key={group.id}
              group={group}
              invitation={invitations.find(invitation => invitation.group === group.id && invitation.invitee === userId)}
              members={members}
              isDisabled={editingGroupId !== null}
            />
          ))
        )
      }
    </CardList>
  );

  function InvitedGroupCard({ group, invitation, members, isDisabled }) {
    const handleAcceptInvitation = async () => {
      try {
        await CONSTANTS.AXIOS.put(`invitations/${invitation.id}/`, {
          ...invitation,
          'accepted_at': new Date().toISOString()
        });
        await CONSTANTS.AXIOS.put(`groups/${group.id}`, {
          ...group,
          'members': [...group.members, userId]
        });
        fetchData();
      } catch (error) {
        console.error('Error updating the group:', error);
      }
    };

    const handleDeclineInvitation = async () => {
      try {
        await CONSTANTS.AXIOS.put(`invitations/${invitation.id}/`, {
          ...invitation,
          'denied_at': new Date().toISOString()
        });
        fetchData();
      } catch (error) {
        console.error('Error updating the group:', error);
      }
    };

    return (
      <Card bg={cardBgColor} px={3} py={4} mb={2}>
        <HStack justifyContent={'space-between'}>
          <VStack align="start">
            <Text fontSize={'small'}>
              Invitation to group
            </Text>
            <Text fontSize={'large'} textColor={'darkgray'}>
              <strong>{group.name}</strong>
            </Text>
            <Text fontSize={'medium'}>
              <strong>{members.find(member => member.id === invitation.inviter)?.username}</strong> invited you to this group on <strong>{formatDate(invitation.created_at)}</strong>
            </Text>
          </VStack>
          <VStack>
            <Button onClick={handleAcceptInvitation} colorScheme="green" isDisabled={isDisabled}>
              Accept invitation
            </Button>
            <Button onClick={handleDeclineInvitation} colorScheme='gray' isDisabled={isDisabled}>
              Decline invitation
            </Button>
          </VStack>
        </HStack>
      </Card>
    );
  }



  function MemberGroupCard({ group, isEditing, onEditClick, onCancelEdit }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [editedGroup, setEditedGroup] = useState(group.id === null ? group : null);


    useEffect(() => {
      if (isEditing) {
        setEditedGroup(group);
      } else {
        setEditedGroup(null);
      }
    }, [isEditing]);
  
      const handleCancelEditClick = () => {
      setEditedGroup(null);
      onCancelEdit();
    };

    const handleSaveClick = async () => {
      try {
        if (editedGroup.id) {
          await CONSTANTS.AXIOS.put(`groups/${editedGroup.id}/`, editedGroup);
        } else {
          await CONSTANTS.AXIOS.post('groups/', editedGroup);
        }
        fetchData();
      } catch (error) {
        console.error('Error updating the group:', error);
      } finally {
        setEditedGroup(null);
        onCancelEdit();
      }
    };

    const handleRemoveClick = () => {
      onOpen();
    };

    const handleRemoveConfirmationClick = async () => {
      try {
        await CONSTANTS.AXIOS.delete(`groups/${group.id}/`);
        fetchData();
        onClose();
      } catch (error) {
        console.error('Error removing the group:', error);
      }
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setEditedGroup(prevState => ({ ...prevState, [name]: value }));
    };

    return (
      <Card bg={cardBgColor} px={3} py={4} mb={2} key={group.id}>
        <HStack justifyContent={'space-between'}>
          <VStack align="start">
            {isEditing ? (
              <FormControl mb={2}>
                <FormLabel>Name</FormLabel>
                <Input
                  name="name"
                  value={editedGroup?.name}
                  onChange={handleInputChange}
                  autoFocus
                />
              </FormControl>
            ) : (
              <Text fontSize={'large'}>
                <strong>{group.name}</strong>
              </Text>
            )}
            <Text>
              Created at {formatDate(group.created_at)}
            </Text>
          </VStack>
          {isEditing ? (
            <VStack mt={4}>
              <Button onClick={handleSaveClick} colorScheme="teal" mr={2}>
                Save
              </Button>
              <Button onClick={handleCancelEditClick} colorScheme="red">
                Cancel
              </Button>
            </VStack>
          ) : (
            <VStack>
              <Button as='a' href={`/groups/${group.id}/expenses`} bg={btnBgColor} isDisabled={editingGroupId !== null}>
                Show group
              </Button>
              <HStack>
                <Button onClick={onEditClick} isDisabled={editingGroupId !== null} colorScheme="blue">
                  Edit
                </Button>
                <Button onClick={handleRemoveClick} isDisabled={editingGroupId !== null} colorScheme="red">
                  Remove
                </Button>
              </HStack>
            </VStack>
          )}
        </HStack>

        {/* Modal for removing confirmation */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Group removing confirmation</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Are you sure to remove group {group.name}? Notice that all its expenses will be lost.
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
              </Button>
              <Button variant='ghost' onClick={handleRemoveConfirmationClick} colorScheme='red'>Remove group</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Card>
    );
  }
}
