const STORAGE_KEY = 'order';

export const getItems = () => {
  const items = localStorage.getItem(STORAGE_KEY);
  return items ? JSON.parse(items) : [];
};

export const addItem = item => {
  const items = getItems();
  items.push(item);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const updateItem = updatedItem => {
  const items = getItems();
  const index = items.findIndex(item => item.id === updatedItem.id);
  if (index !== -1) {
    items[index] = updatedItem;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
};

export const deleteItem = id => {
  const items = getItems();
  const filteredItems = items.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredItems));
};
