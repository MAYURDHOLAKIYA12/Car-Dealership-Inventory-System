const API_BASE = '/api';

const getHeaders = (token) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Auth
  register: async (userData) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  login: async (credentials) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  // Vehicles
  getVehicles: async (token) => {
    const res = await fetch(`${API_BASE}/vehicles`, {
      headers: getHeaders(token),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch vehicles');
    return data;
  },

  searchVehicles: async (params, token) => {
    const query = new URLSearchParams();
    if (params.make) query.append('make', params.make);
    if (params.model) query.append('model', params.model);
    if (params.category) query.append('category', params.category);
    if (params.minPrice) query.append('minPrice', params.minPrice);
    if (params.maxPrice) query.append('maxPrice', params.maxPrice);

    const res = await fetch(`${API_BASE}/vehicles/search?${query.toString()}`, {
      headers: getHeaders(token),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Search failed');
    return data;
  },

  createVehicle: async (vehicleData, token) => {
    const res = await fetch(`${API_BASE}/vehicles`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(vehicleData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create vehicle');
    return data;
  },

  updateVehicle: async (id, vehicleData, token) => {
    const res = await fetch(`${API_BASE}/vehicles/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(vehicleData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update vehicle');
    return data;
  },

  deleteVehicle: async (id, token) => {
    const res = await fetch(`${API_BASE}/vehicles/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete vehicle');
    return data;
  },

  // Inventory
  purchaseVehicle: async (id, token) => {
    const res = await fetch(`${API_BASE}/vehicles/${id}/purchase`, {
      method: 'POST',
      headers: getHeaders(token),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to complete purchase');
    return data;
  },

  restockVehicle: async (id, quantity, token) => {
    const res = await fetch(`${API_BASE}/vehicles/${id}/restock`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ quantity }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to restock vehicle');
    return data;
  },
};
