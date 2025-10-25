// // utils/axiosConfig.js
// import axios from 'axios';
// import { mainDomain } from './mainDomain';

// // ایجاد instance از axios
// const api = axios.create({
//   baseURL: mainDomain,
// });

// // interceptor برای درخواست‌ها (اضافه کردن توکن به هدر)
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // اضافه کردن interceptor برای پاسخ‌ها
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // اگر خطای 401 بود (توکن منقضی شده)
//     if (error.response?.status === 401) {
//       localStorage.removeItem('token');
//       window.location.href = '/login';
//       return Promise.reject(new Error('Token expired'));
//     }
    
//     return Promise.reject(error);
//   }
// );

// export default api;