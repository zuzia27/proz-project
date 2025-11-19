import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API do komunikacji z backendem Spring Boot
export const equipmentApi = {

  async list(status) {
    const allowed = ['SPRAWNY','W_NAPRAWIE','WYCOFANY','WYMAGA_PRZEGLADU'];
    const params = allowed.includes(status) ? { status } : undefined;
    const response = await api.get('/sprzet', { params });
    return response.data;
  },

  async add(item) {
    const response = await api.post('/sprzet', item);
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/sprzet/${id}`);
    return response.data;
  },

  async updateStatus(id, status, nextInspectionDate) {
    const body = nextInspectionDate ? { status, nextInspectionDate } : { status };
    const response = await api.patch(`/sprzet/${id}/status`, body);
    return response.data;
  },

  async downloadReport(status) {
    const params = status ? { status } : undefined;
    const response = await api.get('/raport', {
      params,
      responseType: 'blob', 
    });
    return response.data;
  },
};

