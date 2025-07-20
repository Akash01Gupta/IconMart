const API_BASE = 'http://localhost:5000/api';

// Fetch all products
export const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_BASE}/products`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch products');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(' Failed to fetch products:', error.message);
    throw error;
  }
};

export const getAllProduct = async () => {
  try {
    const response = await fetch(`${API_BASE}/products`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch all products');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch all products:', error.message);
    throw error;
  }
};

// Fetch product by ID
export const getProductById = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/products/${id}`);
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || 'Failed to fetch product');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

// Create product
export const createProduct = async (formData, token, isMultipart = false) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const body = isMultipart ? formData : JSON.stringify(formData);

  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers,
    body,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || 'Failed to create product');
  }

  return data;
};

export const updateProduct = async (id, formData, token, isMultipart = false) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const body = isMultipart ? formData : JSON.stringify(formData);

  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers,
    body,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || 'Failed to update product');
  }

  return data;
};


// Delete product
export const deleteProduct = async (id, token) => {
  try {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(response)
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete product');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to delete product:', error.message);
    throw error;
  }
};