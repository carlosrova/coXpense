import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';

import SignUp from './components/Signup';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import AuthProvider from './components/AuthContext';
import TitleUpdater from './components/TitleUpdater';
import NavbarWithUser from './components/NavbarWithUser';
import CardListWithTabs from './components/CardListWithTabs';
import Groups from './components/Groups';
import Expenses from './components/Expenses';
import Balance from './components/Balance';
import Members from './components/Members';
import Profile from './components/Profile';


const pages = [
  { name: 'Expenses', content: <Expenses /> },
  { name: 'Balance', content: <Balance /> },
  { name: 'Members', content: <Members /> },
];


const App = () => (
  <ChakraProvider>
    <AuthProvider>
      <Router>
        <NavbarWithUser>
          <TitleUpdater />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={<ProtectedRoute> <Groups /> </ProtectedRoute>} />
            <Route path="/groups/:groupId/expenses" element={<ProtectedRoute> <CardListWithTabs header="Expenses" pages={pages} /> </ProtectedRoute>} />
            <Route path="/groups/:groupId/balance" element={<ProtectedRoute> <CardListWithTabs header="Balance" pages={pages} /> </ProtectedRoute>} />
            <Route path="/groups/:groupId/members" element={<ProtectedRoute> <CardListWithTabs header="Members" pages={pages} /> </ProtectedRoute>} />
            <Route path='/profile' element={<ProtectedRoute> <Profile /> </ProtectedRoute>} />
          </Routes>
        </NavbarWithUser>
      </Router>
    </AuthProvider>
  </ChakraProvider>
);

export default App