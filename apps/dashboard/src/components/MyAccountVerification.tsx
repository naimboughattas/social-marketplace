import { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import Button from './Button';
import { Platform } from '../lib/types';
import { useNotifications } from '../lib/notifications';

interface MyAccountVerificationProps {
  platform: Platform;
  username: string;
  isVerified: boolean;
  onStartVerification: () => void;
}

const PLATFORM_NAMES = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  x: 'X',
  facebook: 'Facebook',
  linkedin: 'LinkedIn'
};

export default function MyAccountVerification({
  platform,
  username,
  isVerified,
  onStartVerification
}: MyAccountVerificationProps) {
  const { addNotification } = useNotifications();

  if (isVerified) {
    return (
      <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-4 rounded-lg">
        <CheckCircle className="h-5 w-5" />
        <span>Votre compte {PLATFORM_NAMES[platform]} est vérifié</span>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 p-4 rounded-lg">
      <div className="flex items-start space-x-3">
        <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-yellow-800">
            Compte en attente de vérification
          </h3>
          <p className="mt-1 text-sm text-yellow-700">
            Pour rendre votre compte visible dans le catalogue et commencer à recevoir des commandes, 
            vous devez vérifier que vous êtes bien propriétaire du compte {username} sur {PLATFORM_NAMES[platform]}.
          </p>
          <div className="mt-3">
            <Button
              variant="outline"
              onClick={onStartVerification}
            >
              Commencer la vérification
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}