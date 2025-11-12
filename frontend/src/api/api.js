import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const equipmentApi = {
  async list(status) {
    const allowed = ['SPRAWNY','W_NAPRAWIE','WYCOFANY','WYMAGA_PRZEGLADU'];
    const params = allowed.includes(status) ? { status } : undefined; // ← kluczowe
    const response = await api.get('/sprzet', { params });
    return response.data;
  },
  // reszta bez zmian
  

  async add(item) {
    const response = await api.post('/sprzet', item);
    return response.data;
  },

  
  async getById(id) {
    const response = await api.get(`/sprzet/${id}`);
    return response.data;
  },

  // ...
  // ...
  async updateStatus(id, status, nextInspectionDate) {
    const body = nextInspectionDate ? { status, nextInspectionDate } : { status };
    const res = await api.patch(`/sprzet/${id}/status`, body);
    return res.data; // <- backend powinien odesłać zaktualizowany sprzęt
  },


async downloadReport(status) {
    const params = status ? { status } : undefined;
    const res = await api.get('/raport', {
      params,
      responseType: 'blob', // PDF jako blob
    });
    return res.data;
  },
};
export const mockApi = equipmentApi;


