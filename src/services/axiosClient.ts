import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm Interceptor để tự động đính kèm Token vào Header
axiosClient.interceptors.request.use(function (config) {
    // Lấy token đã lưu trong AuthContext (hoặc localStorage)
    const token = localStorage.getItem('access_token');
    
    if (token) {
        // Gán vào header Authorization theo chuẩn Bearer
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
}, function (error) {
    return Promise.reject(error);
});

export default axiosClient;