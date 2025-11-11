import { Circle } from 'lucide-react';

const statusConfig = {
  SPRAWNY: {
    label: 'Sprawny',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    iconColor: 'text-green-800'
  },
  W_NAPRAWIE: {
    label: 'W naprawie',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    iconColor: 'text-yellow-800'
  },
  WYCOFANY: {
    label: 'Wycofany',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    iconColor: 'text-gray-800'
  },
  WYMAGA_PRZEGLADU: {
    label: 'Wymaga przeglądu',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    iconColor: 'text-red-800'
  }
};

export const StatusBadge = ({ status }) => {
  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
      <Circle className={`w-3 h-3 ${config.iconColor} fill-current`} />
      {config.label}
    </span>
  );
};
