import axios from 'axios';

// Create API instance
const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || '',
});

// ==============================
// Request Interceptor (Attach Token)
// ==============================
API.interceptors.request.use(
    (config) => {
        try {
            const user = JSON.parse(localStorage.getItem('dairyUser') || 'null');

            if (user && user.token) {
                config.headers.Authorization = `Bearer ${user.token}`;
            }
        } catch (error) {
            console.error('Error parsing user from localStorage:', error);
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// ==============================
// Response Interceptor (Handle 401)
// ==============================
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('dairyUser');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ==============================
// AUTH APIs
// ==============================
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);
export const getProfile = () => API.get('/auth/profile');
export const updateProfile = (data) => API.put('/auth/profile', data);

// ==============================
// PRODUCT APIs
// ==============================
export const getProducts = (params) => API.get('/products', { params });
export const getProduct = (id) => API.get(`/products/${id}`);
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// ==============================
// ORDER APIs
// ==============================
export const createOrder = (data) => API.post('/orders', data);
export const getMyOrders = () => API.get('/orders/my');
export const getAllOrders = (params) => API.get('/orders', { params });
export const updateOrderStatus = (id, data) =>
    API.put(`/orders/${id}/status`, data);
export const cancelOrder = (id) => API.put(`/orders/${id}/cancel`);

// ==============================
// USER APIs
// ==============================
export const getAllUsers = (params) => API.get('/users', { params });
export const createUser = (data) => API.post('/users', data);
export const updateUser = (id, data) => API.put(`/users/${id}`, data);
export const deleteUser = (id) => API.delete(`/users/${id}`);

// ==============================
// SUPPLY APIs
// ==============================
export const addSupply = (data) => API.post('/supply', data);
export const getMySupplies = () => API.get('/supply/my');
export const getAllSupplies = () => API.get('/supply');
export const updateSupply = (id, data) => API.put(`/supply/${id}`, data);
export const updatePaymentStatus = (id, data) =>
    API.put(`/supply/${id}/payment`, data);

// ==============================
// DELIVERY APIs
// ==============================
export const getMyDeliveries = (params) =>
    API.get('/delivery/my', { params });
export const updateDeliveryStatus = (id, data) =>
    API.put(`/delivery/${id}/status`, data);
export const createDelivery = (data) => API.post('/delivery', data);
export const getAllDeliveries = () => API.get('/delivery');

// ==============================
// SUBSCRIPTION APIs
// ==============================
export const createSubscription = (data) =>
    API.post('/subscriptions', data);
export const getMySubscriptions = () =>
    API.get('/subscriptions/my');
export const getAllSubscriptions = () =>
    API.get('/subscriptions');
export const updateSubscription = (id, data) =>
    API.put(`/subscriptions/${id}`, data);
export const cancelSubscription = (id) =>
    API.put(`/subscriptions/${id}/cancel`);

// ==============================
// ANALYTICS APIs
// ==============================
export const getAnalytics = () => API.get('/analytics');

// Default export
export default API;