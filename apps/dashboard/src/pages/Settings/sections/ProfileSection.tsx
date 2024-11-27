import { useState } from 'react';
import { useAuth } from '../../../lib/auth';
import { useNotifications } from '../../../lib/notifications';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import { User } from 'lucide-react';

export default function ProfileSection() {
  const { user, updateProfile } = useAuth();
  const { addNotification } = useNotifications();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || '',
    name: user?.name || '',
    company: user?.company || '',
    phone: user?.phone || '',
    language: user?.language || 'fr',
    timezone: user?.timezone || 'Europe/Paris'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      addNotification({
        type: 'success',
        message: 'Profil mis à jour avec succès'
      });
      setIsEditing(false);
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Erreur lors de la mise à jour du profil'
      });
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          Informations personnelles
        </h3>
        <Button
          variant="outline"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Annuler' : 'Modifier'}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center space-x-6">
          <div className="h-20 w-20 rounded-full bg-purple-100 flex items-center justify-center">
            <User className="h-10 w-10 text-purple-600" />
          </div>
          {isEditing && (
            <Button variant="outline" type="button">
              Changer la photo
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={!isEditing}
            required
          />

          <Input
            label="Nom complet"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={!isEditing}
          />

          <Input
            label="Entreprise"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            disabled={!isEditing}
          />

          <Input
            label="Téléphone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            disabled={!isEditing}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Langue
            </label>
            <select
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fuseau horaire
            </label>
            <select
              value={formData.timezone}
              onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            >
              <option value="Europe/Paris">Paris (UTC+1)</option>
              <option value="Europe/London">Londres (UTC)</option>
              <option value="America/New_York">New York (UTC-5)</option>
            </select>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end">
            <Button type="submit">
              Enregistrer les modifications
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}