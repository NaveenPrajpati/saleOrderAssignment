import React, { useState } from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  Switch,
  ColorModeScript,
  extendTheme,
} from '@chakra-ui/react';
import { Navigate, Route, Router, Routes } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import AuthRoute from './components/AuthRoute';

const queryClient = new QueryClient();

function App() {
  const init = localStorage.getItem('chakra-ui-color-mode');
  const theme = extendTheme({
    config: {
      initialColorMode: init,
      useSystemColorMode: false,
    },
  });
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<AuthRoute />}>
            <Route index element={<Dashboard />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;
