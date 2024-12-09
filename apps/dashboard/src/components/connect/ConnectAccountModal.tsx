import { useState } from 'react';
import { X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import Button from '../Button';
import PlatformSelector from './PlatformSelector';
import PlatformAuth from './PlatformAuth';
import { Platform } from '../../lib/types';
import { useNotifications } from '../../lib/notifications';

interface ConnectAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (platform: Platform) => void;
}

type Step = 'platform' | 'auth';

export default function ConnectAccountModal({
  isOpen,
  onClose,
  onConnect
}: ConnectAccountModalProps) {
  const { addNotification } = useNotifications();
  const [step, setStep] = useState<Step>('platform');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);

  const handleConnect = async () => {
    if (!selectedPlatform) return;

    try {
      // Simuler l'authentification avec la plateforme
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onConnect(selectedPlatform);
      addNotification({
        type: 'success',
        message: 'Compte connecté avec succès'
      });
      
      handleClose();
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Erreur lors de la connexion du compte'
      });
    }
  };

  const handleClose = () => {
    setStep('platform');
    setSelectedPlatform(null);
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-lg font-medium text-gray-900">
              {step === 'platform' ? 'Choisir une plateforme' : 'Se connecter'}
            </Dialog.Title>
            <button onClick={handleClose}>
              <X className="h-6 w-6 text-gray-400" />
            </button>
          </div>

          {step === 'platform' ? (
            <PlatformSelector
              selectedPlatform={selectedPlatform}
              onSelect={(platform) => {
                setSelectedPlatform(platform);
                setStep('auth');
              }}
            />
          ) : (
            <PlatformAuth
              platform={selectedPlatform!}
              onBack={() => setStep('platform')}
              onConnect={handleConnect}
            />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}