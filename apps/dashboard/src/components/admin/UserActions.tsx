import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from '../Button';
import * as Dialog from '@radix-ui/react-dialog';
import { useNotifications } from '../../lib/notifications';

interface UserActionsProps {
  onSuspend: () => void;
  onDelete: () => void;
  isSuspended: boolean;
}

export default function UserActions({ onSuspend, onDelete, isSuspended }: UserActionsProps) {
  const { addNotification } = useNotifications();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSuspend = async () => {
    setIsProcessing(true);
    try {
      await onSuspend();
      addNotification({
        type: 'success',
        message: isSuspended ? 'Compte réactivé' : 'Compte suspendu'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Une erreur est survenue'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    setIsProcessing(true);
    try {
      await onDelete();
      addNotification({
        type: 'success',
        message: 'Compte supprimé'
      });
      setShowDeleteConfirm(false);
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Une erreur est survenue'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="flex space-x-3">
        <Button
          variant={isSuspended ? 'primary' : 'outline'}
          onClick={handleSuspend}
          disabled={isProcessing}
        >
          {isProcessing ? 'En cours...' : isSuspended ? 'Réactiver' : 'Suspendre'}
        </Button>
        <Button
          variant="outline"
          className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
          onClick={() => setShowDeleteConfirm(true)}
          disabled={isProcessing}
        >
          Supprimer
        </Button>
      </div>

      <Dialog.Root open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center space-x-3 text-red-600 mb-4">
              <AlertTriangle className="h-6 w-6" />
              <Dialog.Title className="text-lg font-medium">
                Confirmer la suppression
              </Dialog.Title>
            </div>
            
            <p className="text-sm text-gray-500 mb-6">
              Cette action est irréversible. Toutes les données de l'utilisateur seront définitivement supprimées.
            </p>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isProcessing}
              >
                Annuler
              </Button>
              <Button
                variant="outline"
                className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                onClick={handleDelete}
                disabled={isProcessing}
              >
                {isProcessing ? 'Suppression...' : 'Supprimer'}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}