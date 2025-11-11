import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { getStatusLabel } from '../utils/statusLogic';

export const StatusChangeDropdown = ({
  isOpen,
  buttonRef,
  availableStatuses,
  onSelect,
  onClose
}) => {
  const dropdownRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && buttonRef.current && dropdownRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const dropdownHeight = dropdownRef.current.offsetHeight || 200; 
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;
      
      const shouldOpenAbove = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;
      
      setPosition({
        top: shouldOpenAbove 
          ? buttonRect.top + window.scrollY - dropdownHeight - 4
          : buttonRect.bottom + window.scrollY + 4,
        left: buttonRect.right + window.scrollX - 180
      });
    }
  }, [isOpen, buttonRef, availableStatuses.length]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose, buttonRef]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={dropdownRef}
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 9999
      }}
      className="bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-[180px]"
    >
      {availableStatuses.map((status) => (
        <button
          key={status}
          onClick={() => {
            onSelect(status);
            onClose();
          }}
          className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm"
        >
          {getStatusLabel(status)}
        </button>
      ))}
      <button
        onClick={onClose}
        className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm text-gray-600 border-t mt-1 pt-2"
      >
        Anuluj
      </button>
    </div>,
    document.body
  );
};

