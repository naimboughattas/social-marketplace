import { useState } from 'react';
import { useAuth } from '../../../lib/auth';
import { useNotifications } from '../../../lib/notifications';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import Switch from '../../../components/Switch';

export default function SecuritySection() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      addNotification({
        type: 'error',
        message: 'Les mots de passe ne correspondent pas'
      });
      return;
    }

    try {
      // API call to change password
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addNotification({
        type: 'success',
        message: 'Mot de passe modifié avec succès'
      });
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Erreur lors du changement de mot de passe'
      });
    }
  };

  const handleToggle2FA = async () => {
    if (!twoFactorEnabled) {
      setShowQRCode(true);
    } else {
      try {
        // API call to disable 2FA
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTwoFactorEnabled(false);
        addNotification({
          type: 'success',
          message: 'Authentification à deux facteurs désactivée'
        });
      } catch (error) {
        addNotification({
          type: 'error',
          message: 'Erreur lors de la désactivation de l\'authentification à deux facteurs'
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Changement de mot de passe */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          Changer le mot de passe
        </h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Input
            label="Mot de passe actuel"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <Input
            label="Nouveau mot de passe"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Input
            label="Confirmer le nouveau mot de passe"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <div className="flex justify-end">
            <Button type="submit">
              Changer le mot de passe
            </Button>
          </div>
        </form>
      </div>

      {/* Authentification à deux facteurs */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Authentification à deux facteurs
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Ajoutez une couche de sécurité supplémentaire à votre compte
            </p>
          </div>
          <Switch
            checked={twoFactorEnabled}
            onChange={handleToggle2FA}
            label={twoFactorEnabled ? 'Activée' : 'Désactivée'}
          />
        </div>

        {showQRCode && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=otpauth://totp/SocialBoost:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=SocialBoost"
                alt="QR Code"
                className="mx-auto"
              />
              <p className="mt-2 text-sm text-gray-600">
                Scannez ce QR code avec votre application d'authentification
              </p>
            </div>

            <div>
              <Input
                label="Code de vérification"
                placeholder="Entrez le code à 6 chiffres"
                maxLength={6}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowQRCode(false)}
              >
                Annuler
              </Button>
              <Button onClick={() => {
                setTwoFactorEnabled(true);
                setShowQRCode(false);
                addNotification({
                  type: 'success',
                  message: 'Authentification à deux facteurs activée'
                });
              }}>
                Activer
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Sessions actives */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          Sessions actives
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Chrome sur Windows</p>
              <p className="text-sm text-gray-500">Paris, France • Dernière activité il y a 2 minutes</p>
            </div>
            <div className="text-sm text-green-600 font-medium">
              Session actuelle
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Safari sur iPhone</p>
              <p className="text-sm text-gray-500">Lyon, France • Dernière activité hier</p>
            </div>
            <Button variant="outline" size="sm">
              Déconnecter
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <Button variant="outline" className="text-red-600 hover:text-red-700">
            Déconnecter toutes les autres sessions
          </Button>
        </div>
      </div>
    </div>
  );
}