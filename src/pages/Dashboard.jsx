import React, { useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Flex,
  Button,
  Container,
  useColorMode,
  useColorModeValue,
  FormControl,
  Switch,
  FormLabel,
} from '@chakra-ui/react';
import SaleOrders from '../components/SaleOrders';
import { useQuery } from '@tanstack/react-query';
import { getItems } from '../services/operations';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditData, setIsEditData] = useState(false);
  const [filterQuery, setFilterQuery] = useState(false);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['item'],
    queryFn: getItems,
  });
  const navigate = useNavigate();
  const { toggleColorMode, colorMode } = useColorMode();
  const formBackground = useColorModeValue('wheat', 'black');
  return (
    <Container minW={'container.lg'} background={formBackground}>
      <Flex justifyContent={'space-between'} alignItems={'center'}>
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
        <Button
          onClick={() => {
            localStorage.clear();
            navigate('/login');
          }}
          colorScheme="red"
          size="xs"
        >
          Logout
        </Button>
      </Flex>
      <Flex justifyContent={'space-between'} mt={5} background={formBackground}>
        {data?.length != 0 && (
          <Flex gap={2}>
            <Button
              onClick={() => {
                setFilterQuery(false);
              }}
              colorScheme="teal"
              size="md"
              isActive={!filterQuery}
            >
              Active Sale Orders
            </Button>
            <Button
              onClick={() => {
                setFilterQuery(true);
              }}
              colorScheme={'teal'}
              size="md"
              isActive={filterQuery}
            >
              Completed Sale Orders
            </Button>
          </Flex>
        )}
        <Button
          colorScheme="teal"
          size="md"
          onClick={() => setShowAddModal(true)}
        >
          + Sale Order
        </Button>
      </Flex>
      <TableContainer mt={5} background={formBackground}>
        <Table colorScheme="teal">
          {data?.length == 0 ? (
            <TableCaption>No order Created yet</TableCaption>
          ) : (
            <TableCaption>Sales Order Data</TableCaption>
          )}
          <Thead bg={formBackground}>
            <Tr>
              <Th isNumeric>ID</Th>
              <Th>Customer Name</Th>
              <Th>Price (₹)</Th>
              <Th>Last Modified</Th>
              <Th>Edit/View</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data
              ?.filter(it => !filterQuery || it.isCompleted === true)
              .map((item, index) => (
                <Tr bg={item.isCompleted && 'gray'}>
                  <Td>{index + 1}</Td>
                  <Td>{item.custName}</Td>
                  <Td>₹{item.price}</Td>
                  <Td>{item.lastModified}</Td>
                  <Td>
                    <Button
                      onClick={() => {
                        setIsEditData(item);
                        setShowAddModal(true);
                      }}
                    >
                      ...
                    </Button>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>

      {showAddModal && (
        <SaleOrders
          setShowAddModal={setShowAddModal}
          isEditData={isEditData}
          cb={e => {
            setIsEditData({});
          }}
        />
      )}
    </Container>
  );
}
