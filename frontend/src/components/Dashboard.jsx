import { useState, useEffect } from 'react';
import { CheckCircle, Settings, AlertTriangle, Ban, FileText, Plus } from 'lucide-react';
import { EquipmentTable } from './EquipmentTable';
import { EquipmentForm } from './EquipmentForm';
import { shouldAutoUpdateToRequiresInspection } from '../utils/statusLogic';
import { equipmentApi as api } from '../api/api';



export const Dashboard = () => {
  const [equipment, setEquipment] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);   // NIE tablica
  const [isFormOpen, setIsFormOpen] = useState(false);          // NIE []

  // Funkcja ładująca dane z backendu – teraz ASYNC
  const loadEquipment = async () => {
    try {
      const data = await api.list();
      setEquipment(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Błąd przy pobieraniu sprzętu:', error);
      setEquipment([]);
    }
  };

useEffect(() => { loadEquipment(); }, []);

  // Z listy z backendu robimy wersję z effectiveStatus (tak jak tabela)
const withEffective = (Array.isArray(equipment) ? equipment : []).map((it) => {
  let effective = it?.status;
  if (effective === 'SPRAWNY' && it?.nextInspectionDate) {
    const d = new Date(it.nextInspectionDate);
    const today = new Date();
    const dMid = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const tMid = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (dMid <= tMid) effective = 'WYMAGA_PRZEGLADU'; // <= KLUCZ
  }
  return { ...it, effectiveStatus: effective };
});

const getStatusCount = (s) =>
  withEffective.filter((x) => x.effectiveStatus === s).length;



  // Dodawanie sprzętu – też ASYNC, po zapisie odświeżamy listę
const handleAddEquipment = async (newEquipment) => {
  try {
    const saved = await api.add(newEquipment);
    setEquipment(prev => [...prev, saved]); // szybka aktualizacja UI
    // ewentualnie: await loadEquipment();
    setIsFormOpen(false);
  } catch (e) {
    console.error('Błąd dodawania:', e);
  }
};

const handleStatusChange = async (id, status, nextInspectionDate) => {
  try {
    await api.updateStatus(id, status, nextInspectionDate);
    await loadEquipment();           // refetch = świeże dane do tabeli i kafelków
  } catch (e) {
    console.error('Błąd zmiany statusu', e);
  }
};


const handleDownloadPdf = async () => {
  try {
    const blob = await api.downloadReport(); // możesz przekazać selectedStatus
    const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'raport-sprzet.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (e) {
    console.error('Błąd generowania raportu:', e);
    alert('Nie udało się wygenerować raportu PDF.');
  }
};

  const getEffectiveStatus = (item) => {
  if (item.status === 'SPRAWNY' && shouldAutoUpdateToRequiresInspection(item.nextInspectionDate)) {
    return 'WYMAGA_PRZEGLADU';
  }
  return item.status;
};


  const stats = [
    {
      label: 'Sprawny sprzęt',
      count: getStatusCount('SPRAWNY'),
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      icon: <CheckCircle className="w-5 h-5" />
    },
    {
      label: 'W naprawie',
      count: getStatusCount('W_NAPRAWIE'),
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      icon: <Settings className="w-5 h-5" />
    },
    {
      label: 'Wymaga przeglądu',
      count: getStatusCount('WYMAGA_PRZEGLADU'),
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600',
      icon: <AlertTriangle className="w-5 h-5" />
    },
    {
      label: 'Wycofany',
      count: getStatusCount('WYCOFANY'),
      bgColor: 'bg-gray-100',
      iconColor: 'text-gray-600',
      icon: <Ban className="w-5 h-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                System do ewidencji sprzętu medycznego
              </h1>
              <p className="text-gray-600 mt-1">
                Zarządzaj sprzętem medycznym w swojej placówce
              </p>
            </div>
            <div className="flex gap-3">
            <button
              onClick={handleDownloadPdf}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Generuj raport PDF
            </button>

              <button
                onClick={() => setIsFormOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Dodaj nowy sprzęt
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${stat.bgColor} ${stat.iconColor}`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <EquipmentTable
          equipment={equipment}
          onStatusChange={handleStatusChange}
        />

        <EquipmentForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleAddEquipment}
        />
      </div>
    </div>
  );
};
