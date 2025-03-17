import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Text,
  Card,
  HStack,
  VStack,
  Center,
  Spinner,
  useColorModeValue,
  Button,
  Input,
  FormControl,
  FormLabel,
  Select
} from '@chakra-ui/react';
import { Select as MultipleSelect } from "chakra-react-select";
import formatDate from '../utils/formatDate';
import { CONSTANTS } from '../utils/constants';

function Expenses() {
  const [isLoading, setIsLoading] = useState(true);
  const [members, setMembers] = useState([])
  const [expenses, setExpenses] = useState([]);
  const [editedExpense, setEditedExpense] = useState(null);
  const { groupId } = useParams();

  const cardBgColor = useColorModeValue('white', 'gray.800');
  const secondaryTextColor = useColorModeValue('gray.400', 'white');


  useEffect(() => {
    fetchData();
  }, [groupId]);
  
  async function fetchData() {
    try {
      const apiUrl = `/groups/${groupId}/?include[]=members.*&include[]=expenses.*`
      const expensesResponse = await CONSTANTS.AXIOS.get(apiUrl);

      setMembers(expensesResponse.data.users);
      setExpenses(expensesResponse.data.expenses);

    } catch (error) {
      console.error('Error fetching the data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleEditClick = (expense) => {
    console.log(expense)
    setEditedExpense(expense);
  };

  const handleCancelEditClick = () => {
    editedExpense?.id
      ? setEditedExpense(null)
      : setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== null));
      setEditedExpense(null);
    };
  

  const handleSaveClick = async () => {
    if (editedExpense && editedExpense.name && editedExpense.user && editedExpense.users_sharing_expense) {
      try {
        if (editedExpense.id) {
          await CONSTANTS.AXIOS.put(`expenses/${editedExpense.id}/`, editedExpense);
        } else {
          await CONSTANTS.AXIOS.post('expenses/', { ...editedExpense, group: groupId });
        }
        fetchData();
      } catch (error) {
        console.error('Error updating the expense:', error);
      } finally {
        setEditedExpense(null);
      }
    }
  };

  const handleRemoveClick = async (expense) => {
    try {
      await CONSTANTS.AXIOS.delete(`expenses/${expense.id}`)
      setExpenses(prevExpenses => prevExpenses.filter(e => e.id !== expense.id))
    } catch (error) {
      console.error('Error updating the expense:', error);
    } finally {
      setEditedExpense(null);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedExpense(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSingleSelectChange = (e) => {
    const { name, value } = e.target
    setEditedExpense(prevState => ({ ...prevState, [name]: value }));
  };

  const handleMultipleSelectChange = (selectedOptions, { name }) => {
    const selectedUsersId = selectedOptions.map(option => option.value)
    console.log("selectedUsers --->>> ", selectedUsersId)
    setEditedExpense(prevState => ({ ...prevState, [name]: selectedUsersId }));
  };

  const handleAddExpense = () => {
    const newEmptyExpense = {
      id: null,
      name: '',
      user: 0,
      amount: 0,
      spent_at: new Date().toISOString(),
      users_sharing_expense: [],
      description: '',
    };

    setExpenses(prevExpenses => prevExpenses ? [newEmptyExpense, ...prevExpenses] : [newEmptyExpense]);
    setEditedExpense(newEmptyExpense);
  };

  if (isLoading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return (
    <>
      <Button onClick={() => handleAddExpense()} colorScheme="blue" mb={5} isDisabled={editedExpense}>
        Add expense
      </Button>
      {expenses
        ?.sort((a, b) => new Date(b.spent_at) - new Date(a.spent_at)) // TODO: Ordenar en descendente/ascendente
        ?.map((expense) => (
          <Card bg={cardBgColor} key={expense.id} mb={2}>
            <HStack paddingX={3} paddingY={5} justifyContent={'space-between'}>
              <VStack align="start">
                {editedExpense?.id === expense.id
                  ? (
                    <FormControl mb={2}>
                      <FormLabel>Name</FormLabel>
                      <Input
                        name="name"
                        value={editedExpense.name}
                        onChange={handleInputChange}
                      />
                    </FormControl>
                  ) : (
                    <Text key={'name-' + expense.id} fontSize={'large'}>
                      <strong>{expense.name}</strong>
                    </Text>
                  )}
                {editedExpense?.id === expense.id
                  ? (
                    <FormControl mb={2}>
                      <FormLabel>Paid by</FormLabel>
                      <Select
                        name="user"
                        placeholder='Select user'
                        value={editedExpense.user}
                        onChange={handleSingleSelectChange}
                      >
                        {members?.map((member) => (
                          <option key={member.username} value={member.id}>
                            {member.username}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    <Text key={'paid-by-' + expense.id}>
                      Paid by <strong>{members.find(user => user.id === expense.user)?.username}</strong>
                    </Text>
                  )}
                {editedExpense?.id === expense.id
                  ? (
                    <FormControl mb={2}>
                      <FormLabel>Shared by</FormLabel>
                      <MultipleSelect
                        isMulti
                        name="users_sharing_expense"
                        value={
                          editedExpense.users_sharing_expense.map(userId => ({
                            label: members.find(user => user.id === userId).username,
                            value: userId
                          }))
                        }
                        onChange={handleMultipleSelectChange}
                        options={members?.map(user => ({
                          label: user.username,
                          value: user.id,
                        })) || []}
                        placeholder="Select users who share this expense"
                        closeMenuOnSelect={false}
                        colorScheme="purple"
                      />
                    </FormControl>
                  ) : (
                    <Text key={'shared-by-' + expense.id} color={secondaryTextColor}>
                      Shared by{" "}
                      {expense.users_sharing_expense.map((userId, index) => (
                        <React.Fragment key={userId}>
                          {index > 0 && ", "}
                          {members.find(user => user.id === userId).username}
                        </React.Fragment>
                      ))}
                    </Text>
                  )}
              </VStack>
              <VStack>
                {editedExpense?.id === expense.id
                  ? (
                    <FormControl mb={2}>
                      <FormLabel>Amount</FormLabel>
                      <Input
                        name="amount"
                        type="number"
                        value={editedExpense.amount}
                        onChange={handleInputChange}
                      />
                    </FormControl>
                  ) : (
                    <Text key={'amount-' + expense.id}>
                      {expense.amount} €
                    </Text>
                  )}
                {editedExpense?.id === expense.id
                  ? (
                    <FormControl mb={2}>
                      <FormLabel>Date</FormLabel>
                      <Input
                        name="spent_at"
                        type="date"
                        value={new Date(editedExpense.spent_at).toISOString().split('T')[0]}
                        onChange={handleInputChange}
                      />
                    </FormControl>
                  ) : (
                    <Text key={'date-' + expense.id} color={secondaryTextColor}>
                      {formatDate(expense.spent_at)}
                    </Text>
                  )}
              </VStack>
              <VStack align='bottom'>
                {editedExpense?.id === expense.id ? (
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
                    <Button onClick={() => handleEditClick(expense)} isDisabled={editedExpense} colorScheme="blue">
                      Edit
                    </Button>
                    <Button onClick={() => handleRemoveClick(expense)} isDisabled={editedExpense} colorScheme="red">
                      Remove
                    </Button>
                  </VStack>
                )}
              </VStack>
            </HStack>
          </Card>
        ))}
    </>
  );
}

export default Expenses;
