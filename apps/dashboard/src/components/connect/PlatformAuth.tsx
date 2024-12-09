import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Button from '../Button';
import Input from '../Input';
import { Platform } from '../../lib/types';
import PlatformIcon from '../PlatformIcon';

interface PlatformAuthProps {
  platform: Platform;
  onBack: () => void;
  onConnect: () => void;
}

export default function PlatformAuth({
  platform,
  onBack,
  onConnect
}: PlatformAuthProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConnect();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-2 rounded-lg text-gray-400 hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center space-x-2">
          <PlatformIcon platform={platform} />
          <span className="font-medium capitalize">
            {platform === 'x' ? 'Twitter' : platform}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <Input
          label="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="pt-4">
          <Button type="submit" className="w-full">
            Se connecter
          </Button>
        </div>
      </form>

      <p className="text-sm text-gray-500 text-center">
        Nous n'enregistrons jamais votre mot de passe. La connexion se fait directement avec la plateforme.
      </p>
    </div>
  );
}