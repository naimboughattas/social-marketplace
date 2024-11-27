import { useState } from 'react';
import { Check, X } from 'lucide-react';
import Input from './Input';

interface EditableFieldProps {
  value: string;
  onSave: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export default function EditableField({ 
  value, 
  onSave, 
  disabled = false,
  className = ''
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center space-x-2">
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className={`flex-1 ${className}`}
          autoFocus
        />
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
      className={`text-left ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:text-purple-600'} ${className}`}
      disabled={disabled}
    >
      {value}
    </button>
  );
}