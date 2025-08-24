import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

const apiClient = axios.create({
  baseURL: API_URL,
});

export const sendFrame = async (imageData: string): Promise<{ message: string; file: string }> => {
  const response = await apiClient.post('/frames', { imageData });
  return response.data;
};