import { Switch } from '@headlessui/react';
import { cn } from '../../lib/utils';

interface EditableToggleProps {
  value: boolean;
  label: string;
  onToggle: (value: boolean) => void;
}

export default function EditableToggle({ value, label, onToggle }: EditableToggleProps) {
  return (
    <Switch.Group>
      <div className="flex items-center">
        <Switch
          checked={value}
          onChange={onToggle}
          className={cn(
            value ? 'bg-purple-600' : 'bg-gray-200',
            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2'
          )}
        >
          <span
            className={cn(
              value ? 'translate-x-5' : 'translate-x-0',
              'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
            )}
          />
        </Switch>
        <Switch.Label className="ml-3 text-sm text-gray-600">
          {label}
        </Switch.Label>
      </div>
    </Switch.Group>
  );
}