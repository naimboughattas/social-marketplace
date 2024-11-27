import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useState, useEffect } from 'react';
import { format, isToday, isYesterday, isThisWeek, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function formatDate(date: Date): string {
  const now = new Date();
  const diffInDays = differenceInDays(now, date);
  const time = format(date, 'HH:mm', { locale: fr });

  if (isToday(date)) {
    return `aujourd'hui à ${time}`;
  }

  if (isYesterday(date)) {
    return `hier à ${time}`;
  }

  if (isThisWeek(date) && diffInDays <= 7) {
    return format(date, "EEEE 'à' HH:mm", { locale: fr });
  }

  return format(date, "d MMM. 'à' HH:mm", { locale: fr });
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}