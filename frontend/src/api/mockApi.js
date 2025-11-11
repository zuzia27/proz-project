// TODO: Replace mockApi.js with real API integration (Axios + Spring Boot endpoints)

const STORAGE_KEY = 'medical_equipment_inventory';

const INITIAL_DATA = [
  {
    id: 1,
    name: 'Mikroskop X200',
    model: 'X200-PRO',
    type: 'Mikroskop',
    serialNumber: '001',
    location: 'LAB 123',
    status: 'SPRAWNY',
    nextInspectionDate: '2025-12-10'
  },
  {
    id: 2,
    name: 'Aparat USG',
    model: 'Z-500',
    type: 'USG',
    serialNumber: '002',
    location: 'LAB 206A',
    status: 'WYMAGA_PRZEGLADU',
    nextInspectionDate: '2025-10-15'
  },
  {
    id: 3,
    name: 'Wirówka laboratoryjna',
    model: 'WIR-1000',
    type: 'Wirówka',
    serialNumber: '003323',
    location: 'LAB C',
    status: 'W_NAPRAWIE',
    nextInspectionDate: '2025-11-25'
  },
  {
    id: 4,
    name: 'Spektrofotometr UV',
    model: 'UV-2000',
    type: 'Spektrofotometr',
    serialNumber: '00423',
    location: 'LAB D',
    status: 'WYCOFANY',
    nextInspectionDate: ''
  }
];

function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
  }
  saveData(INITIAL_DATA);
  return INITIAL_DATA;
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
}

export const mockApi = {
  list(status) {
    const data = loadData();
    if (status) {
      return data.filter(item => item.status === status);
    }
    return data;
  },

  add(item) {
    const data = loadData();
    const newId = data.length > 0 ? Math.max(...data.map(e => e.id)) + 1 : 1;
    const newItem = { ...item, id: newId };
    data.push(newItem);
    saveData(data);
    return newItem;
  },

  updateStatus(id, status, nextInspectionDate) {
    const data = loadData();
    const index = data.findIndex(item => item.id === id);
    if (index === -1) return null;

    const updates = { status };

    if (status === 'WYCOFANY') {
      updates.nextInspectionDate = '';
    } else if (nextInspectionDate !== undefined) {
      updates.nextInspectionDate = nextInspectionDate;
    }

    data[index] = { ...data[index], ...updates };
    saveData(data);
    return data[index];
  },

  getById(id) {
    const data = loadData();
    return data.find(item => item.id === id) || null;
  }
};

