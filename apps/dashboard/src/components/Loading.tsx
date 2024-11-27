import { cn } from '../lib/utils';

interface SpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Spinner({ className, size = 'md' }: SpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-b-2 border-purple-600',
        {
          'h-4 w-4': size === 'sm',
          'h-8 w-8': size === 'md',
          'h-12 w-12': size === 'lg',
        },
        className
      )}
    />
  );
}

export function LoadingOverlay() {
  return (
    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
      <div className="flex space-x-4">
        <div className="h-20 w-20 bg-gray-200 rounded-full"/>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"/>
          <div className="h-3 bg-gray-200 rounded w-1/2"/>
          <div className="h-3 bg-gray-200 rounded w-1/4"/>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="h-8 bg-gray-200 rounded"/>
        <div className="h-8 bg-gray-200 rounded"/>
        <div className="h-8 bg-gray-200 rounded"/>
      </div>
    </div>
  );
}