import React, { useEffect, useState } from 'react';
import { Box, Center, Text, Stack, useColorModeValue, Tab, Tabs, TabList, TabPanel, TabPanels } from '@chakra-ui/react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { CONSTANTS } from '../utils/constants';

function CardListWithTabs({ pages }) {

    const [groupName, setGroupName] = useState('')
    const navigate = useNavigate();
    const location = useLocation();
    const { groupId } = useParams();

    async function fetchData() {
        try {
            const response = await CONSTANTS.AXIOS.get(`/groups/${groupId}`);
            setGroupName(response.data.group.name)
            
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    useEffect(() => { fetchData() }, [])

    const cardBgColor = useColorModeValue('white', 'gray.800');
    const stackBgColor = useColorModeValue('gray.400', 'white');
    const innerCardBgColor = useColorModeValue('orange.100', 'gray.300');


    // Mapear las rutas de las pestañas con sus respectivos índices
    const tabRoutes = pages.map(page => page.name.toLowerCase());
    const currentTab = tabRoutes.findIndex(route => location.pathname.includes(route));

    // Cambiar la URL al cambiar de pestaña
    const handleTabsChange = (index) => {
        const selectedRoute = tabRoutes[index];
        navigate(`/groups/${groupId}/${selectedRoute}`); //TODO: groupId no está funcionando
    };

    return (
        <Center py={6}>
            <Box
                maxW={700}
                w={'full'}
                bg={cardBgColor}
                boxShadow={'2xl'}
                rounded={'md'}
                overflow={'hidden'}>
                <Stack
                    textAlign={'center'}
                    p={6}
                    color={stackBgColor}
                    align={'center'}>
                    <Text
                        fontSize={'xx-large'}
                        fontWeight={500}
                        p={2}
                        px={3}
                        color={'orange.500'}
                        rounded={'full'}>
                        {groupName}
                    </Text>
                </Stack>

                {/* Tabs de Chakra UI sincronizadas con la URL */}
                <Tabs index={currentTab >= 0 ? currentTab : 0} onChange={handleTabsChange} variant='enclosed'>
                    <TabList>
                        {pages?.map((page, index) => (
                            <Tab
                                key={index}
                                _selected={{ bg: 'orange.100', fontWeight:'bold', fontSize:"xl"}}
                                >
                                {page.name}
                            </Tab>
                        ))}
                    </TabList>
                    <TabPanels>
                        {pages?.map((page, index) => (
                            <TabPanel key={index} bg={innerCardBgColor}>
                                <Box bg={innerCardBgColor}>
                                    {page.content}
                                </Box>
                            </TabPanel>
                        ))}
                    </TabPanels>
                </Tabs>
            </Box>
        </Center>
    );
}

export default CardListWithTabs;