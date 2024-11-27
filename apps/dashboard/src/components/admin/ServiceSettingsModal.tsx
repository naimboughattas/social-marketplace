import { useState } from 'react';
import { X } from 'lucide-react';
import Button from '../Button';
import Input from '../Input';
import { Service } from '../../lib/types';
import { useNotifications } from '../../lib/notifications';

interface ServiceSettings {
  service: Service;
  price: number;
  isActive: boolean;
}

interface ServiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: ServiceSettings[];
  onSave: (services: ServiceSettings[]) => void;
}

export default function ServiceSettingsModal({
  isOpen,
  onClose,
  services: initialServices,
  onSave
}: ServiceSettingsModalProps) {
  const { addNotification } = useNotifications();
  const [services, setServices] = useState(initialServices);

  const handleSave = async () => {
    try {
      await onSave(services);
      addNotification({
        type: 'success',
        message: 'Services mis à jour avec succès'
      });
      onClose();
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Erreur lors de la mise à jour des services'
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Paramètres des services
          </h3>
          <button onClick={onClose}>
            <X className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        <div className="space-y-4">
          {services.map((service, index) => (
            <div key={service.service} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={service.isActive}
                    onChange={(e) => {
                      const newServices = [...services];
                      newServices[index] = {
                        ...service,
                        isActive: e.target.checked
                      };
                      setServices(newServices);
                    }}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-900">
                    {service.service}
                  </span>
                </label>
                <Input
                  type="number"
                  value={service.price}
                  onChange={(e) => {
                    const newServices = [...services];
                    newServices[index] = {
                      ...service,
                      price: parseFloat(e.target.value)
                    };
                    setServices(newServices);
                  }}
                  disabled={!service.isActive}
                  min="0"
                  step="0.01"
                  className="w-24"
                />
              </div>
            </div>
          ))}

          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button onClick={handleSave}>
              Enregistrer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}