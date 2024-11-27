import { useState } from 'react';
import { Card, Title, TextInput } from '@tremor/react';
import { Search, Instagram, Youtube, Facebook, Linkedin, CheckCircle, Clock } from 'lucide-react';
import { TikTok } from '../icons/TikTok';
import { Twitter } from '../icons/Twitter';
import Button from '../Button';
import { Platform } from '../../lib/types';
import { useNotifications } from '../../lib/notifications';

interface PendingVerification {
  id: string;
  platform: Platform;
  username: string;
  displayName: string;
  profileImage: string;
  verificationCode: string;
  codeSent: boolean;
  createdAt: Date;
}

interface PendingVerificationsProps {
  verifications: PendingVerification[];
  onVerify: (id: string, code: string) => void;
}

export default function PendingVerifications({ verifications, onVerify }: PendingVerificationsProps) {
  const { addNotification } = useNotifications();
  const [search, setSearch] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [selectedVerification, setSelectedVerification] = useState<string | null>(null);

  const handleVerify = (id: string) => {
    if (!verificationCode.trim()) {
      addNotification({
        type: 'error',
        message: 'Veuillez entrer le code de vérification'
      });
      return;
    }

    onVerify(id, verificationCode);
    setVerificationCode('');
    setSelectedVerification(null);
  };

  const getPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="h-5 w-5 text-pink-600" />;
      case 'tiktok':
        return <TikTok className="h-5 w-5" />;
      case 'youtube':
        return <Youtube className="h-5 w-5 text-red-600" />;
      case 'x':
        return <Twitter className="h-5 w-5 text-gray-900" />;
      case 'facebook':
        return <Facebook className="h-5 w-5 text-blue-600" />;
      case 'linkedin':
        return <Linkedin className="h-5 w-5 text-blue-700" />;
    }
  };

  const filteredVerifications = verifications.filter(v => 
    v.username.toLowerCase().includes(search.toLowerCase()) ||
    v.displayName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Title>En attente de vérification</Title>
          <TextInput
            icon={Search}
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          {filteredVerifications.map((verification) => (
            <div
              key={verification.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={verification.profileImage}
                  alt={verification.displayName}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    {getPlatformIcon(verification.platform)}
                    <span className="font-medium">{verification.username}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {verification.codeSent ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Code envoyé
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        En attente d'envoi
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {verification.codeSent && (
                <div className="flex items-center space-x-2">
                  {selectedVerification === verification.id ? (
                    <>
                      <TextInput
                        placeholder="Code de vérification"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                      />
                      <Button onClick={() => handleVerify(verification.id)}>
                        Vérifier
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedVerification(null)}
                      >
                        Annuler
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setSelectedVerification(verification.id)}
                    >
                      Entrer le code
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}

          {filteredVerifications.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Aucune vérification en attente
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}