import * as RadixSwitch from '@radix-ui/react-switch';
import { cn } from '../lib/utils';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
}

export default function Switch({ checked, onChange, disabled = false, className = '', label }: SwitchProps) {
  return (
    <div className="flex items-center space-x-2">
      <RadixSwitch.Root
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        className={cn(
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none',
          checked ? 'bg-green-500' : 'bg-gray-200',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        <RadixSwitch.Thumb
          className={cn(
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
            checked ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </RadixSwitch.Root>
      {label && (
        <span className={cn(
          "text-sm",
          disabled ? "text-gray-400" : "text-gray-600"
        )}>
          {label}
        </span>
      )}
    </div>
  );
}