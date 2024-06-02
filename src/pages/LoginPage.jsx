import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Switch,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginPage, setIsLoginPage] = useState(true);
  const navigate = useNavigate();
  const { toggleColorMode, colorMode } = useColorMode();
  const formBackground = useColorModeValue('gray.100', 'gray.700');

  const handleSubmit = e => {
    e.preventDefault();
    if (username === 'admin' && password === 'password') {
      localStorage.setItem('isLogin', 'true');
      localStorage.setItem('user', JSON.stringify({ username, password }));

      navigate('/');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex h="100vh" alignItems="center" justifyContent="center">
        <Flex
          flexDirection="column"
          bg={formBackground}
          p={12}
          borderRadius={8}
          boxShadow="lg"
        >
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="dark_mode" mb="0">
              Enable Dark Mode?
            </FormLabel>
            <Switch
              id="dark_mode"
              colorScheme="teal"
              size="lg"
              isChecked={colorMode == 'dark' ? true : false}
              onChange={toggleColorMode}
            />
          </FormControl>
          <Heading mb={6}>{isLoginPage ? 'Log In' : 'Sign Up'}</Heading>
          <Input
            placeholder="username"
            type="text"
            variant="filled"
            mb={3}
            onChange={e => setUsername(e.target.value)}
          />
          {!isLoginPage && (
            <Input
              placeholder="example@gmail.com"
              type="email"
              variant="filled"
              mb={3}
              onChange={e => setEmail(e.target.value)}
            />
          )}
          <Input
            placeholder="**********"
            type="password"
            variant="filled"
            mb={6}
            onChange={e => setPassword(e.target.value)}
          />
          <Button colorScheme="teal" mb={8} type="submit">
            {isLoginPage ? 'Log In' : 'sign up'}
          </Button>
          {/* <Flex gap={0} alignItems={'center'}>
            <Button onClick={() => setIsLoginPage(pre => !pre)}>
              <Text as={'u'}>Not Registered</Text>
            </Button>
            <Text
              as={'p'}
              fontWeight={'500'}
              onClick={() => setIsLoginPage(pre => !pre)}
            >
              Click here
            </Text>
          </Flex> */}
        </Flex>
      </Flex>
    </form>
  );
};

export default LoginPage;
