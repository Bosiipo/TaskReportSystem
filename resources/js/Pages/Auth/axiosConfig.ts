import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000', // Your Laravel API base URL
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Add token from localStorage
        'X-Inertia': 'true',
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true, // Include cookies for Sanctum
});

export default axiosInstance;