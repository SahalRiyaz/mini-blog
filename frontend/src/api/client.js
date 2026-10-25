import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('miniblog_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle session expiration
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired
      if (localStorage.getItem('miniblog_token')) {
        localStorage.removeItem('miniblog_token');
        localStorage.removeItem('miniblog_user');
        window.dispatchEvent(new Event('auth-logout'));
      }
    }
    return Promise.reject(error);
  }
);

// API Service Wrappers
export const api = {
  // Auth
  login: (credentials) => client.post('/auth/login', credentials),
  register: (userData) => client.post('/auth/register', userData),
  getMe: () => client.get('/auth/me'),

  // Posts
  getPosts: (params) => client.get('/posts', { params }),
  getPost: (id) => client.get(`/posts/${id}`),
  createPost: (postData) => client.post('/posts', postData),
  updatePost: (id, postData) => client.put(`/posts/${id}`, postData),
  deletePost: (id) => client.delete(`/posts/${id}`),

  // Comments
  getComments: (postId) => client.get(`/posts/${postId}/comments`),
  addComment: (postId, commentData) => client.post(`/posts/${postId}/comments`, commentData),
};

export default client;
