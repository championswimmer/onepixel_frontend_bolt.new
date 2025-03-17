import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './auth';
import type { CreateUrlRequest, UrlResponse, UrlInfoResponse } from '../types/api';
import { API_BASE_URL } from '../constants';

export const useUrlStore = defineStore('urls', {
  state: () => ({
    urls: [] as UrlResponse[],
  }),
  
  actions: {
    async fetchUrls() {
      const authStore = useAuthStore();
      try {
        const response = await axios.get<UrlResponse[]>(`${API_BASE_URL}/urls`, {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });
        this.urls = response.data;
        return response.data;
      } catch (error) {
        console.error('Error fetching URLs:', error);
        throw error;
      }
    },
    
    async createRandomUrl(data: CreateUrlRequest) {
      const authStore = useAuthStore();
      try {
        const response = await axios.post<UrlResponse>(
          `${API_BASE_URL}/urls`,
          data,
          {
            headers: { Authorization: `Bearer ${authStore.token}` },
          }
        );
        this.urls.push(response.data);
        return response.data;
      } catch (error) {
        console.error('Error creating random URL:', error);
        throw error;
      }
    },
    
    async createSpecificUrl(shortcode: string, data: CreateUrlRequest) {
      const authStore = useAuthStore();
      try {
        const response = await axios.put<UrlResponse>(
          `${API_BASE_URL}/urls/${shortcode}`,
          data,
          {
            headers: { Authorization: `Bearer ${authStore.token}` },
          }
        );
        this.urls.push(response.data);
        return response.data;
      } catch (error) {
        console.error('Error creating specific URL:', error);
        throw error;
      }
    },
    
    async getUrlInfo(shortcode: string) {
      try {
        const response = await axios.get<UrlInfoResponse>(
          `${API_BASE_URL}/urls/${shortcode}`
        );
        return response.data;
      } catch (error) {
        console.error('Error getting URL info:', error);
        throw error;
      }
    },
  },
});