import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const compact = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined && v !== null && v !== '')
  );

export const equipmentApi = {
  async list(status) {
    const allowed = ['SPRAWNY', 'W_NAPRAWIE', 'WYCOFANY', 'WYMAGA_PRZEGLADU'];
    const params = allowed.includes(status) ? { status } : undefined;
    const response = await api.get('/sprzet', { params });
    return response.data;
  },

  async add(item) {
    const response = await api.post('/sprzet', item);
    return response.data;
  },

  async updateStatus(id, status, nextInspectionDate) {
    const body = nextInspectionDate ? { status, nextInspectionDate } : { status };
    const res = await api.patch(`/sprzet/${id}/status`, body);
    return res.data;
  },

  // ⬇⬇⬇ KLUCZOWA METODA DO PDF-a ⬇⬇⬇
  async downloadReport(filters = {}) {
    const params = compact({
      status: filters.status,
      location: filters.location,
      type: filters.type,
      sortBy: filters.sortBy === 'inspectionDate' ? 'inspectionDate' : 'name',
      sortDir: 'asc',
    });

    const res = await api.get('/raport', {
      params,
      responseType: 'blob',
    });
    return res.data;
  },
};

export const mockApi = equipmentApi;
