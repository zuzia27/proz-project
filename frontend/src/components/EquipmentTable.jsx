import { useState, useRef } from 'react';
import { X, FileText } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { DateInputModal } from './DateInputModal';
import { StatusChangeDropdown } from './StatusChangeDropdown';
import { EQUIPMENT_TYPES } from '../types/Equipment';
import {
  getAvailableStatusTransitions,
  requiresNewInspectionDate,
  isInspectionDateApproaching,
  isInspectionDateOverdue
} from '../utils/statusLogic';

export const EquipmentTable = ({ equipment, onStatusChange, onDownloadReport }) => {
  const safeEquipment = Array.isArray(equipment) ? equipment : [];

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('name');

  const [editingStatusId, setEditingStatusId] = useState(null);
  const [pendingStatusChange, setPendingStatusChange] = useState(null);
  const buttonRefs = useRef({});

  const getDateDisplay = (item) => {
    const { nextInspectionDate, status } = item;

    if (!nextInspectionDate || status === 'WYCOFANY') {
      return {
        dateText: '-',
        dateColor: 'text-gray-400',
        showWarning: false,
        isGrayed: false
      };
    }

    const isGrayed = status === 'W_NAPRAWIE';
    const dateColor = isGrayed
      ? 'text-gray-400'
      : isInspectionDateOverdue(nextInspectionDate)
      ? 'text-red-600 font-medium'
      : 'text-gray-900';

    const showWarning =
      !isGrayed &&
      status !== 'WYCOFANY' &&
      isInspectionDateApproaching(nextInspectionDate);

    return {
      dateText: nextInspectionDate,
      dateColor,
      showWarning,
      isGrayed
    };
  };

  const filteredAndSorted = safeEquipment
    .filter((item) => {
      const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
      const matchesLocation =
        !locationFilter ||
        item.location?.toLowerCase().includes(locationFilter.toLowerCase());
      const matchesType = typeFilter === 'ALL' || item.type === typeFilter;
      return matchesStatus && matchesLocation && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        if (!a.nextInspectionDate && !b.nextInspectionDate) return 0;
        if (!a.nextInspectionDate) return 1;
        if (!b.nextInspectionDate) return -1;
        return a.nextInspectionDate.localeCompare(b.nextInspectionDate);
      }
    });

  const handleStatusChangeClick = (id, fromStatus, toStatus) => {
    if (requiresNewInspectionDate(fromStatus, toStatus)) {
      setPendingStatusChange({ id, fromStatus, toStatus });
    } else {
      onStatusChange(id, toStatus);
    }
    setEditingStatusId(null);
  };

  const handleDateConfirm = (date) => {
    if (pendingStatusChange) {
      onStatusChange(pendingStatusChange.id, pendingStatusChange.toStatus, date);
      setPendingStatusChange(null);
    }
  };

  const clearAllFilters = () => {
    setStatusFilter('ALL');
    setLocationFilter('');
    setTypeFilter('ALL');
  };

  const hasActiveFilters =
    statusFilter !== 'ALL' || locationFilter !== '' || typeFilter !== 'ALL';

  // ⬇⬇⬇ TU PRZEKAZUJEMY FILTRY DO GÓRY ⬇⬇⬇
  const handleDownloadClick = () => {
    const filters = {
      status: statusFilter === 'ALL' ? undefined : statusFilter,
      location: locationFilter || undefined,
      type: typeFilter === 'ALL' ? undefined : typeFilter,
      sortBy,
    };

    if (onDownloadReport) {
      onDownloadReport(filters);
    }
  };

  return (
    <div className="space-y-4 pb-64">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
              Status:
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Wszystkie</option>
              <option value="SPRAWNY">Sprawny</option>
              <option value="W_NAPRAWIE">W naprawie</option>
              <option value="WYCOFANY">Wycofany</option>
              <option value="WYMAGA_PRZEGLADU">Wymaga przeglądu</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="location-filter" className="text-sm font-medium text-gray-700">
              Lokalizacja:
            </label>
            <input
              type="text"
              id="location-filter"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              placeholder="Wpisz lokalizację..."
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
            />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="type-filter" className="text-sm font-medium text-gray-700">
              Typ urządzenia:
            </label>
            <select
              id="type-filter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Wszystkie</option>
              {EQUIPMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4" />
              Wyczyść filtry
            </button>
          )}

          <div className="ml-auto text-sm text-gray-600">
            Znaleziono:{' '}
            <span className="font-semibold">{filteredAndSorted.length}</span> pozycji
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <label htmlFor="sort-by" className="text-sm font-medium text-gray-700">
              Sortowanie:
            </label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Nazwa</option>
              <option value="inspectionDate">Data przeglądu</option>
            </select>
          </div>

          <button
            onClick={handleDownloadClick}
            className="ml-auto flex items-center gap-2 px-3.5 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            <FileText className="w-4 h-4" />
            Generuj PDF
          </button>
        </div>
      </div>

      {/* tabela */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-1/6 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nazwa urządzenia
                </th>
                <th className="w-1/8 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Typ
                </th>
                <th className="w-1/8 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Numer seryjny
                </th>
                <th className="w-1/8 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lokalizacja
                </th>
                <th className="w-1/6 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="w-1/6 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data następnego przeglądu
                </th>
                <th className="w-1/8 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Akcje
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSorted.map((item) => {
                const availableTransitions = getAvailableStatusTransitions(item.status);
                const isRetired = item.status === 'WYCOFANY';

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-gray-50 ${isRetired ? 'opacity-60' : ''}`}
                  >
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </div>
                        {item.model && (
                          <div className="text-sm text-gray-500 truncate">
                            Model: {item.model}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 truncate">
                      {item.type}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.serialNumber}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 truncate">
                      {item.location}
                    </td>
                    <td className="px-4 py-4">
                      <div className="w-full">
                        <StatusBadge status={item.status} />
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      {(() => {
                        const dateDisplay = getDateDisplay(item);
                        return (
                          <div className="flex flex-col">
                            <span className={dateDisplay.dateColor}>
                              {dateDisplay.dateText}
                            </span>
                            {dateDisplay.showWarning && (
                              <span className="text-xs text-red-400 mt-0.5">
                                Zbliża się termin
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      {isRetired ? (
                        <span className="text-gray-400 text-xs">Brak akcji</span>
                      ) : (
                        <>
                          <button
                            ref={(el) => (buttonRefs.current[item.id] = el)}
                            onClick={() => setEditingStatusId(item.id)}
                            className="text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap"
                          >
                            Zmień status
                          </button>
                          <StatusChangeDropdown
                            isOpen={editingStatusId === item.id}
                            buttonRef={{ current: buttonRefs.current[item.id] }}
                            availableStatuses={availableTransitions}
                            onSelect={(status) =>
                              handleStatusChangeClick(item.id, item.status, status)
                            }
                            onClose={() => setEditingStatusId(null)}
                          />
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <DateInputModal
        isOpen={pendingStatusChange !== null}
        onClose={() => setPendingStatusChange(null)}
        onConfirm={handleDateConfirm}
        title="Podaj datę następnego przeglądu"
        message="Aby zmienić status na 'Sprawny', musisz określić datę następnego przeglądu technicznego."
      />
    </div>
  );
};
