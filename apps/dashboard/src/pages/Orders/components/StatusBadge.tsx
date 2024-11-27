import { Clock } from 'lucide-react';
import { OrderStatus, STATUS_STYLES, STATUS_LABELS } from '../types';
import * as Tooltip from '@radix-ui/react-tooltip';
import { getTimeLeft } from '../../../components/TimeRemaining';

interface StatusBadgeProps {
  status: OrderStatus;
  date?: Date | null;
  type?: 'delivery' | 'validation';
}

export default function StatusBadge({ status, date, type }: StatusBadgeProps) {
  return (
    <div className="flex items-center space-x-2">
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}>
        {STATUS_LABELS[status]}
      </span>
      {(status === 'in_progress' || status === 'delivered') && date && (
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button className="text-gray-400 hover:text-gray-600">
                <Clock className="h-4 w-4" />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="bg-gray-900 text-white px-2 py-1 rounded text-sm"
                sideOffset={5}
              >
                {getTimeLeft(date, type || 'delivery')}
                <Tooltip.Arrow className="fill-gray-900" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      )}
    </div>
  );
}