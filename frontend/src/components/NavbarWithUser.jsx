import React from 'react';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Text,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Image
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import coXpenseIco from '../assets/coXpenseIco.png';


const Links = [
  { name: 'Groups', path: '/' }
];


const NavLink = ({ name, path }) => {
  const location = useLocation();
  const isActive = location.pathname === path;
  const linkBgColor = useColorModeValue('orange.200', 'orange.100')
  const linkBgActiveHoverColor = useColorModeValue('orange.300', 'orange.300')
  const linkBgInactiveHoverColor = useColorModeValue('gray.300', 'gray.300')

  return (
    <Link to={path}>
      <Box
        px={2}
        py={1}
        rounded={'md'}
        bg={isActive ? linkBgColor : 'transparent'}
        _hover={{
          textDecoration: 'none',
          bg: isActive ? linkBgActiveHoverColor : linkBgInactiveHoverColor,
        }}
      >
        {name}
      </Box>
    </Link>
  );
};


export default function NavbarWithUser({ children }) {
  const { userId, logout, avatarUrl } = useAuth()
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const boxBgColor = useColorModeValue('gray.100', 'gray.100')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleProfile = () => {
    navigate(`/profile`)
  }

  return (
    <>
      <Box bg={boxBgColor} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Box>
              <Image src={coXpenseIco} alt="Logo coXpense" boxSize="40px" /> {/* Ajusta boxSize según lo necesites */}
            </Box>
            <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
              {Links.map((link) => (
                <NavLink key={link.path} name={link.name} path={link.path} />
              ))}
            </HStack>
          </HStack>
            <Text fontSize="3xl" fontWeight="bold" fontFamily="'Comic Sans MS', cursive, sans-serif" color='orange.500'>
              coXpense
            </Text>
          <Flex alignItems={'center'}>
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}
              >
                <Avatar
                  size={'sm'}
                  src={avatarUrl}
                />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => navigate(`/profile`)}>My Profile</MenuItem>
                <MenuDivider />
                <MenuItem onClick={handleLogout}>Log out</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen && (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link.path} name={link.name} path={link.path} />
              ))}
            </Stack>
          </Box>
        )}
      </Box>

      <Box p={4}>{children}</Box>
    </>
  );
}
