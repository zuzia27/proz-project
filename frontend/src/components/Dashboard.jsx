import { useState, useEffect } from 'react';
import { CheckCircle, Settings, AlertTriangle, Ban, FileText, Plus } from 'lucide-react';
import { mockApi } from '../api/mockApi';
import { EquipmentTable } from './EquipmentTable';
import { EquipmentForm } from './EquipmentForm';

export const Dashboard = () => {
  const [equipment, setEquipment] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    loadEquipment();
  }, []);

  const loadEquipment = () => {
    const data = mockApi.list();
    setEquipment(data);
  };

  const handleAddEquipment = (newEquipment) => {
    mockApi.add(newEquipment);
    loadEquipment();
  };

  const handleStatusChange = (id, status, newInspectionDate) => {
    mockApi.updateStatus(id, status, newInspectionDate);
    loadEquipment();
  };

  const getStatusCount = (status) => {
    return equipment.filter(e => e.status === status).length;
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
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
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
