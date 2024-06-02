import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Box,
  Checkbox,
} from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addItem, getItems, updateItem } from '../services/operations';
import { dummyData } from '../utils/productSchema';
import Select from 'react-select';

const now = new Date();
const formattedTime = now.toLocaleString('en-GB', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
});

const SaleOrders = ({ cb, setShowAddModal, isEditData }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [formData, setFormData] = useState({
    custName: user.username,
    lastModified: formattedTime,
    price: isEditData?.price ? isEditData.price : '',
    isCompleted: isEditData?.isCompleted ? isEditData.isCompleted : false,
  });
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [selectedSkus, setSelectedSkus] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState({});

  useEffect(() => {
    if (selectedProduct && selectedProduct.length > 0) {
      const selectedSkusSet = new Set();

      selectedProduct.forEach(selectedItem => {
        const matchingItem = dummyData.find(
          item => item.id === selectedItem.value
        );
        if (matchingItem && matchingItem.sku) {
          matchingItem.sku.forEach(skuItem => selectedSkusSet.add(skuItem));
        }
      });

      setSelectedSkus(Array.from(selectedSkusSet));
    } else {
      setSelectedSkus([]); // Clear selectedSkus if selectedProduct is empty
    }
  }, [selectedProduct]);

  console.log(selectedSkus);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const newArr = dummyData.map(it => {
    return { value: it.id, label: it.name };
  });

  const selSku = selectedSkus.map(it => {
    return {
      value: it.amount,
      label: `SKU ${it.id} (₹${it.amount})`,
    };
  });
  // console.log(selectedProduct);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['item'],
    queryFn: getItems,
  });

  // console.log('d-', data);

  const [orderData, setOrderData] = useState({
    id: data.length + 1,
    custName: '',
    price: '',
    lastModified: new Date(),
    completed: false,
  });

  const handleEdit = order => {
    setSelectedOrder(order);
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addItem,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['item'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item'] });
    },
  });

  function handleSubmit() {
    if (Object.keys(isEditData).length) {
      cb();
    } else {
      mutation.mutate(formData);
      setShowAddModal(false);
      cb();
    }
  }

  return (
    <Modal
      isOpen={true}
      onClose={() => {
        setShowAddModal(false);
        cb();
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            placeholder="username"
            type="text"
            variant="filled"
            mb={3}
            value={user.username}
            onChange={e => {}}
          />
          <Input
            placeholder="username"
            type="text"
            variant="filled"
            mb={3}
            value={formattedTime}
            onChange={e => {}}
          />
          {/* <Input
            placeholder="username"
            type="datetime-local"
            variant="filled"
            mb={3}
            value={formattedTime}
            onChange={e => {}}
          /> */}

          <Select
            placeholder="All Products"
            isMulti
            options={newArr}
            onChange={v => {
              setSelectedProduct(v);
            }}
          />
          <Box marginY={5}>
            <Select
              isDisabled={selectedProduct.length == 0}
              placeholder={'SKUs'}
              options={selSku}
              onChange={v => {
                setFormData(prev => ({
                  ...prev,
                  price: v.value,
                }));
              }}
            />
          </Box>

          <Checkbox
            isChecked={formData?.isCompleted}
            onChange={e => {
              setFormData(prev => ({
                ...prev,
                isCompleted: e.target.checked,
              }));
            }}
          >
            Paid
          </Checkbox>
        </ModalBody>

        <ModalFooter>
          <Button
            isDisabled={selectedProduct.length == 0 || selectedSkus.length == 0}
            colorScheme="blue"
            onClick={handleSubmit}
          >
            Add Order
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SaleOrders;
