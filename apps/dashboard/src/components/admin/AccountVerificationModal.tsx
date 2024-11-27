import { useState } from 'react';
import { X } from 'lucide-react';
import Button from '../Button';
import { Platform } from '../../lib/types';
import { useNotifications } from '../../lib/notifications';

interface AccountVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: Platform;
  username: string;
  onVerificationComplete: () => void;
}

export default function AccountVerificationModal({
  isOpen,
  onClose,
  platform,
  username,
  onVerificationComplete
}: AccountVerificationModalProps) {
  const { addNotification } = useNotifications();
  const [verificationCode] = useState(() => {
    // Générer un code unique basé sur le nom d'utilisateur et un timestamp
    const timestamp = Date.now().toString(36);
    const userHash = username.replace(/[^a-z0-9]/gi, '').slice(0, 6);
    return `VERIFY-${userHash}-${timestamp}`.toUpperCase();
  });

  const handleVerificationSent = async () => {
    try {
      // API call to update verification status
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addNotification({
        type: 'success',
        message: 'Merci ! Nous allons vérifier votre message et activer votre compte.'
      });
      
      onVerificationComplete();
      onClose();
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Une erreur est survenue'
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Vérification de votre compte
          </h3>
          <button onClick={onClose}>
            <X className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-700">
              Pour vérifier que vous êtes bien propriétaire du compte {username}, 
              veuillez nous envoyer un message depuis votre compte {platform} avec le code suivant :
            </p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-center font-mono text-lg">{verificationCode}</p>
          </div>

          <div className="text-sm text-gray-600">
            <p>Une fois le message envoyé, cliquez sur "J'ai envoyé le code".</p>
            <p>Nous vérifierons votre message et activerons votre compte dans les plus brefs délais.</p>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button onClick={handleVerificationSent}>
              J'ai envoyé le code
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}