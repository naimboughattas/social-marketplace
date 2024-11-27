import { useState } from 'react';
import { X } from 'lucide-react';
import Button from './Button';
import Input from './Input';
import * as Dialog from '@radix-ui/react-dialog';

interface ReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  title: string;
  description: string;
  submitLabel?: string;
}

export default function ReasonModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  description,
  submitLabel = 'Envoyer'
}: ReasonModalProps) {
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (!reason.trim()) return;
    onSubmit(reason);
    setReason('');
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-medium text-gray-900">
              {title}
            </Dialog.Title>
            <button onClick={onClose}>
              <X className="h-6 w-6 text-gray-400" />
            </button>
          </div>

          <p className="text-sm text-gray-500 mb-4">
            {description}
          </p>

          <div className="space-y-4">
            <Input
              label="Motif"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Entrez votre motif..."
              required
            />

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button onClick={handleSubmit} disabled={!reason.trim()}>
                {submitLabel}
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}