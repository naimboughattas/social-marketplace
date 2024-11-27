import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';

export const DELIVERY_WINDOW = 48 * 60 * 60 * 1000; // 48 hours for delivery
export const VALIDATION_WINDOW = 24 * 60 * 60 * 1000; // 24 hours for validation

interface TimeRemainingProps {
  date: Date | undefined | null;
  type: 'delivery' | 'validation';
  showIcon?: boolean;
  className?: string;
}

export default function TimeRemaining({ 
  date, 
  type,
  showIcon = true,
  className = ''
}: TimeRemainingProps) {
  const [timeLeft, setTimeLeft] = useState<string>(calculateTimeLeft(date, type));

  useEffect(() => {
    // Update time every minute
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(date, type));
    }, 60000);

    return () => clearInterval(interval);
  }, [date, type]);

  if (!date) {
    return null;
  }

  if (showIcon) {
    return (
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button className={`text-gray-400 hover:text-gray-600 ${className}`}>
              <Clock className="h-4 w-4" />
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              className="bg-gray-900 text-white px-2 py-1 rounded text-sm"
              sideOffset={5}
            >
              {timeLeft}
              <Tooltip.Arrow className="fill-gray-900" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    );
  }

  return (
    <span className={`text-sm text-gray-500 ${className}`}>
      {timeLeft}
    </span>
  );
}

export function calculateTimeLeft(date: Date | undefined | null, type: 'delivery' | 'validation'): string {
  if (!date) return 'Délai non disponible';

  const window = type === 'delivery' ? DELIVERY_WINDOW : VALIDATION_WINDOW;
  const now = new Date().getTime();
  const timeLeft = (date.getTime() + window) - now;

  if (timeLeft <= 0) return 'Délai expiré';

  const hours = Math.floor(timeLeft / (60 * 60 * 1000));
  const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));

  return `${hours}h${minutes}m restantes`;
}

export function getTimeLeft(date: Date | undefined | null, type: 'delivery' | 'validation'): string {
  return calculateTimeLeft(date, type);
}

export function isExpired(date: Date | undefined | null, type: 'delivery' | 'validation'): boolean {
  if (!date) return false;

  const window = type === 'delivery' ? DELIVERY_WINDOW : VALIDATION_WINDOW;
  const now = new Date().getTime();
  const timeLeft = (date.getTime() + window) - now;

  return timeLeft <= 0;
}

export function getRemainingTime(date: Date | undefined | null, type: 'delivery' | 'validation'): {
  hours: number;
  minutes: number;
  isExpired: boolean;
} {
  if (!date) {
    return {
      hours: 0,
      minutes: 0,
      isExpired: false
    };
  }

  const window = type === 'delivery' ? DELIVERY_WINDOW : VALIDATION_WINDOW;
  const now = new Date().getTime();
  const timeLeft = (date.getTime() + window) - now;

  if (timeLeft <= 0) {
    return {
      hours: 0,
      minutes: 0,
      isExpired: true
    };
  }

  return {
    hours: Math.floor(timeLeft / (60 * 60 * 1000)),
    minutes: Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000)),
    isExpired: false
  };
}