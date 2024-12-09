import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ExternalLink, X } from 'lucide-react';
import Button from '../Button';
import { formatDate } from '../../lib/utils';

interface DeliveryProofModalProps {
  isOpen: boolean;
  proofUrl: string;
  onConfirm: () => void;
  onDispute: () => void;
  onClose?: () => void;
  confirmedAt?: Date | null;
}

export default function DeliveryProofModal({
  isOpen,
  proofUrl,
  onConfirm,
  onDispute,
  onClose,
  confirmedAt
}: DeliveryProofModalProps) {
  const isConfirmed = !!confirmedAt;

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-lg">
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <Dialog.Title className="text-lg font-medium text-gray-900">
                  Preuve de livraison
                </Dialog.Title>
                <p className="mt-1 text-sm text-gray-500">
                  {isConfirmed 
                    ? 'Preuve de livraison validée.'
                    : 'Veuillez vérifier la preuve de livraison avant de confirmer ou contester.'}
                </p>
              </div>
              {(isConfirmed && onClose) && (
                <button 
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <a
                href={proofUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-purple-600 hover:text-purple-700"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Voir la preuve de livraison
              </a>
            </div>

            <div className="flex justify-end space-x-3">
              {isConfirmed ? (
                <div className="text-green-600 font-medium">
                  Confirmée le {formatDate(confirmedAt)}
                </div>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={onDispute}
                    className="text-red-600 hover:text-red-700"
                  >
                    Contester
                  </Button>
                  <Button onClick={onConfirm}>
                    Confirmer
                  </Button>
                </>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}