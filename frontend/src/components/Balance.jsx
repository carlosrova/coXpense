import { useState, useEffect, useColorModeValue } from "react";
import { CONSTANTS } from "../utils/constants";
import { useParams } from "react-router-dom";
import CardList from "./CardList";
import {
    Text,
    Center,
    Spinner,
    HStack,
    VStack,
    Box,
    Card
} from "@chakra-ui/react";



export default function Balance() {
    const [isLoading, setIsLoading] = useState(true);
    const [balance, setBalance] = useState([])
    const [members, setMembers] = useState([])
    const { groupId } = useParams();

    useEffect(() => {
        console.log('useEffect Balance')
        async function fetchData() {
            try {
                console.log('fetchData Balance')
                const responseBalance = await CONSTANTS.AXIOS.get(`/groups/${groupId}/balance`);
                const responseMembers = await CONSTANTS.AXIOS.get(`/groups/${groupId}/members`);
                console.log('responseBalance', responseBalance)
                setBalance(responseBalance.data)
                setMembers(responseMembers.data.users)
            } catch (error) {
                console.error('Error fetching the data:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [groupId]);

    if (isLoading) {
        return (
            <Center>
                <Spinner />
            </Center>
        );
    }

    return (
        <Card>
            <HStack alignItems="flex-start" spacing={0} bg={'white'} px={3} py={5}>
                <HStack spacing={5}>
                    <VStack>
                        {balance.rows?.map(row =>
                            <Text key={row.user} alignSelf={'flex-start'} whiteSpace="nowrap">
                                <strong>{members.find(member => member.id === row.user).username}</strong>
                            </Text>
                        )}
                    </VStack>
                    <VStack>
                        {balance.rows?.map(row =>
                            <Text key={row.user} alignSelf={'flex-end'} whiteSpace="nowrap">
                                {row.amount}
                            </Text>
                        )}
                    </VStack>
                </HStack>
                {/* Left Column for Negative Amounts */}
                <VStack w={'50%'} ml={4} borderRight='1px solid black'>
                    {balance.rows?.map(row =>
                        <Box key={row.user} alignSelf={'flex-end'} width={row.amount > 0 ? 0 : `${-row.amount / balance.max_amount * 100}%`} bg={"red"} color={'red'}>
                            &nbsp;
                        </Box>
                    )}
                </VStack>
                {/* Right Column for Positive Amounts */}
                <VStack w={'50%'}>
                    {balance.rows?.map(row =>
                        <Box key={row.user} alignSelf={'flex-start'} width={row.amount < 0 ? 0 : `${row.amount / balance.max_amount * 100}%`} bg={"green"} color={'green'}>
                            &nbsp;
                        </Box>
                    )}
                </VStack>
            </HStack>
        </Card>
    )
}
