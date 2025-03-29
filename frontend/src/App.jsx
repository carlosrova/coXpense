import React from "react";
import { BrowserRouter as Router, Routes } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

import { appRoutes } from "./routes/routes";
import AuthProvider from "./contexts/AuthContext";
import NavbarWithUser from "./components/NavbarWithUser";
import TitleUpdater from "./components/TitleUpdater";

const App = () => (
  <ChakraProvider>
    <AuthProvider>
      <Router>
        <NavbarWithUser>
          <TitleUpdater />
          <Routes>
            { appRoutes }
          </Routes>
        </NavbarWithUser>
      </Router>
    </AuthProvider>
  </ChakraProvider>
);

export default App;
