// Dostępne przejścia między statusami
export function getAvailableStatusTransitions(currentStatus) {
  switch (currentStatus) {
    case 'SPRAWNY':
      return ['W_NAPRAWIE', 'WYCOFANY'];
    
    case 'W_NAPRAWIE':
      return ['SPRAWNY', 'WYCOFANY'];
    
    case 'WYMAGA_PRZEGLADU':
      return ['SPRAWNY', 'W_NAPRAWIE', 'WYCOFANY'];
    
    case 'WYCOFANY':
      return []; // Sprzęt wycofany - brak możliwych akcji
    
    default:
      return [];
  }
}

// Walidacja: czy przy zmianie statusu wymagana jest nowa data przeglądu?
// TAK - gdy zmieniamy na SPRAWNY z W_NAPRAWIE lub WYMAGA_PRZEGLADU
export function requiresNewInspectionDate(fromStatus, toStatus) {
  if (toStatus !== 'SPRAWNY') return false;
  
  return fromStatus === 'W_NAPRAWIE' || fromStatus === 'WYMAGA_PRZEGLADU';
}

// Sprawdzenie czy data przeglądu zbliża się (1-3 dni) - do ostrzeżenia
export function isInspectionDateApproaching(inspectionDate) {
  if (!inspectionDate) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const inspection = new Date(inspectionDate);
  inspection.setHours(0, 0, 0, 0);
  
  const diffTime = inspection.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays >= 1 && diffDays <= 3;
}

// Sprawdzenie czy data przeglądu minęła - do kolorowania na czerwono
export function isInspectionDateOverdue(inspectionDate) {
  if (!inspectionDate) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const inspection = new Date(inspectionDate);
  inspection.setHours(0, 0, 0, 0);
  
  // Data po terminie (włącznie z dzisiaj)
  return inspection.getTime() <= today.getTime();
}

export function getStatusLabel(status) {
  const labels = {
    SPRAWNY: 'Sprawny',
    W_NAPRAWIE: 'W naprawie',
    WYCOFANY: 'Wycofany',
    WYMAGA_PRZEGLADU: 'Wymaga przeglądu'
  };
  
  return labels[status];
}

