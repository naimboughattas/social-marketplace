import { useState } from 'react';
import { Check, X } from 'lucide-react';
import Input from './Input';

interface EditablePriceProps {
  value: number;
  onSave: (value: number) => void;
  disabled?: boolean;
  className?: string;
}

export default function EditablePrice({ 
  value, 
  onSave, 
  disabled = false,
  className = ''
}: EditablePriceProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value.toString());

  const handleSave = () => {
    const numValue = parseFloat(editValue);
    if (!isNaN(numValue) && numValue >= 0) {
      onSave(numValue);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value.toString());
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center space-x-2">
        <div className="relative">
          <Input
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className={`w-20 pr-6 ${className}`}
            min="0"
            step="0.1"
            autoFocus
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">€</span>
        </div>
        <button
          onClick={handleSave}
          className="p-1 text-green-600 hover:text-green-700"
        >
          <Check className="h-4 w-4" />
        </button>
        <button
          onClick={handleCancel}
          className="p-1 text-red-600 hover:text-red-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => !disabled && setIsEditing(true)}
      className={`${disabled ? 'cursor-not-allowed opacity-50' : 'hover:text-purple-600'} ${className}`}
      disabled={disabled}
    >
      {value.toFixed(2)} €
    </button>
  );
}