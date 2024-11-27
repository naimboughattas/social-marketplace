import { useState } from 'react';
import { Copy, CheckCircle, AlertCircle } from 'lucide-react';
import Button from './Button';
import { Platform } from '../lib/types';
import { useNotifications } from '../lib/notifications';

interface VerificationInstructionsProps {
  platform: Platform;
  username: string;
  verificationCode: string;
  onVerificationSent: () => void;
  onClose: () => void;
}

const PLATFORM_INSTRUCTIONS = {
  instagram: {
    message: "Envoyez-nous un message direct sur Instagram (@socialboost) avec ce code.",
    link: "https://instagram.com/socialboost"
  },
  tiktok: {
    message: "Commentez ce code sur notre dernière vidéo TikTok.",
    link: "https://tiktok.com/@socialboost/latest"
  },
  youtube: {
    message: "Commentez ce code sur notre vidéo de présentation YouTube.",
    link: "https://youtube.com/watch?v=example"
  },
  x: {
    message: "Envoyez-nous un message privé sur X avec ce code.",
    link: "https://twitter.com/messages/compose?recipient_id=socialboost"
  },
  facebook: {
    message: "Envoyez-nous un message sur Facebook avec ce code.",
    link: "https://m.me/socialboost"
  },
  linkedin: {
    message: "Envoyez-nous un message sur LinkedIn avec ce code.",
    link: "https://linkedin.com/company/socialboost"
  }
};

export default function VerificationInstructions({
  platform,
  username,
  verificationCode,
  onVerificationSent,
  onClose
}: VerificationInstructionsProps) {
  const { addNotification } = useNotifications();
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(verificationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addNotification({
      type: 'success',
      message: 'Code copié dans le presse-papier'
    });
  };

  const handleVerificationSent = async () => {
    setIsLoading(true);
    try {
      await onVerificationSent();
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Une erreur est survenue'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-purple-900 mb-2">
          Dernière étape : Vérification de votre compte
        </h3>
        <p className="text-sm text-purple-700">
          Pour finaliser l'ajout de votre compte et commencer à recevoir des commandes, 
          nous devons vérifier que vous êtes bien propriétaire du compte <strong>{username}</strong>.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-medium">
              1
            </div>
            <div>
              <p className="font-medium text-gray-900">Voici votre code de vérification</p>
              <p className="text-sm text-gray-500">
                Copiez ce code unique qui prouve que vous êtes propriétaire du compte
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
          >
            {copied ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="p-4 bg-gray-100 rounded-lg">
          <code className="text-lg font-mono text-purple-600">
            {verificationCode}
          </code>
        </div>

        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-medium">
            2
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">Envoyez-nous le code</p>
            <p className="text-sm text-gray-500 mt-1">
              {PLATFORM_INSTRUCTIONS[platform].message}
            </p>
            <a
              href={PLATFORM_INSTRUCTIONS[platform].link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center mt-2 text-sm text-purple-600 hover:text-purple-700"
            >
              Cliquez ici pour nous contacter
            </a>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-medium">
            3
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">Confirmez l'envoi</p>
            <p className="text-sm text-gray-500 mt-1">
              Une fois le code envoyé, cliquez sur le bouton ci-dessous. 
              Nous vérifierons votre message et activerons votre compte dans les plus brefs délais.
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            onClick={handleVerificationSent}
            disabled={isLoading}
          >
            {isLoading ? 'En cours...' : 'J\'ai envoyé le code'}
          </Button>
        </div>
      </div>
    </div>
  );
}