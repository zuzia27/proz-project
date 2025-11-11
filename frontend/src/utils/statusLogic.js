export function getAvailableStatusTransitions(currentStatus) {
  switch (currentStatus) {
    case 'SPRAWNY':
      return ['W_NAPRAWIE', 'WYCOFANY'];
    
    case 'W_NAPRAWIE':
      return ['SPRAWNY', 'WYCOFANY'];
    
    case 'WYMAGA_PRZEGLADU':
      return ['SPRAWNY', 'W_NAPRAWIE', 'WYCOFANY'];
    
    case 'WYCOFANY':
      return [];
    
    default:
      return [];
  }
}

export function requiresNewInspectionDate(fromStatus, toStatus) {
  if (toStatus !== 'SPRAWNY') return false;
  
  return fromStatus === 'W_NAPRAWIE' || fromStatus === 'WYMAGA_PRZEGLADU';
}

export function shouldAutoUpdateToRequiresInspection(inspectionDate) {
  if (!inspectionDate) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const inspection = new Date(inspectionDate);
  inspection.setHours(0, 0, 0, 0);
  
  return inspection.getTime() <= today.getTime();
}

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

export function isInspectionDateOverdue(inspectionDate) {
  if (!inspectionDate) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const inspection = new Date(inspectionDate);
  inspection.setHours(0, 0, 0, 0);
  
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

