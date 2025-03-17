import { defineStore } from 'pinia';
import axios from 'axios';
import type { LoginRequest, UserResponse } from '../types/api';
import { API_BASE_URL } from '../constants';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as UserResponse | null,
    token: localStorage.getItem('token') || null,
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  
  actions: {
    async login(credentials: LoginRequest) {
      try {
        const response = await axios.post<UserResponse>(
          `${API_BASE_URL}/users/login`,
          credentials
        );
        this.user = response.data;
        this.token = response.data.token;
        localStorage.setItem('token', response.data.token);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
    },
  },
});