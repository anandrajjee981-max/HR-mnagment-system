import axios from 'axios';

const api = axios.create({
    baseURL: 'https://hr-mnagment-system.onrender.com/api',
    withCredentials: true,
});

export default api;