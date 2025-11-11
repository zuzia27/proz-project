import { useState } from 'react';

export const DateInputModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message
}) => {
  const [date, setDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (date) {
      onConfirm(date);
      setDate('');
      onClose();
    }
  };

  const handleCancel = () => {
    setDate('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">{title}</h2>
          <p className="text-gray-600 mb-4">{message}</p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="inspection-date" className="block text-sm font-medium text-gray-700 mb-2">
                Data następnego przeglądu *
              </label>
              <input
                type="date"
                id="inspection-date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Anuluj
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
              >
                Potwierdź
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

