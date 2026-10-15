// src/lib/api.js ke aakhir mein add karo:

// ==========================================
// PRODUCT CRUD APIS
// ==========================================

// 1. Get All Products with Pagination
export const fetchProductsApi = async (page = 1, limit = 5) => {
  const response = await API.get(`/api/products?page=${page}&limit=${limit}`);
  return response.data;
};

// 2. Create New Product
export const createProductApi = async (data) => {
  const payload = {
    id: 0, // Backend macro id ignore karta hai insert par
    name: data.name,
    price: parseInt(data.price),
  };
  const response = await API.post('/api/products', payload);
  return response.data;
};

// 3. Update Product by ID (PUT)
export const updateProductApi = async (id, data) => {
  const payload = {
    id: parseInt(id),
    name: data.name,
    price: parseInt(data.price),
  };
  const response = await API.put(`/api/products/${id}`, payload);
  return response.data;
};

// 4. Delete Product by ID
export const deleteProductApi = async (id) => {
  const response = await API.delete(`/api/products/${id}`);
  return response.data;
};