import React from 'react'
import {
  Box,
  Center,
  Text,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react'


export default function CardList({header, children}) {
  const cardBgColor = useColorModeValue('white', 'gray.800')
  const stackBgColor = useColorModeValue('gray.400', 'white')
  const innerCardBgColor = useColorModeValue('orange.100', 'gray.300')

  return (
    <Center py={6}>
      <Box
        maxW={'700px'}
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
            {header}
          </Text>
        </Stack>

        <Box bg={innerCardBgColor} px={6} py={10}>
          {children}
        </Box>
      </Box>
    </Center>
  );
}