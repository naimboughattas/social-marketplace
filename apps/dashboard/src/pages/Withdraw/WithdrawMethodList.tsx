import { useState } from 'react';
import { Building2, Wallet, Plus, X } from 'lucide-react';
import Button from '../../components/Button';
import { useNotifications } from '../../lib/notifications';
import WithdrawMethodForm from './components/WithdrawMethodForm';
import WithdrawMethodCard from './components/WithdrawMethodCard';
import { WithdrawMethod } from './types';

export default function WithdrawMethodList() {
  const { addNotification } = useNotifications();
  const [methods, setMethods] = useState<WithdrawMethod[]>(() => {
    const saved = localStorage.getItem('withdraw_methods');
    return saved ? JSON.parse(saved) : [];
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddMethod = (method: WithdrawMethod) => {
    const updatedMethods = [...methods, method];
    setMethods(updatedMethods);
    localStorage.setItem('withdraw_methods', JSON.stringify(updatedMethods));
    setShowAddForm(false);
    addNotification({
      type: 'success',
      message: 'Méthode de retrait ajoutée avec succès'
    });
  };

  const handleDelete = (id: string) => {
    const updatedMethods = methods.filter(m => m.id !== id);
    setMethods(updatedMethods);
    localStorage.setItem('withdraw_methods', JSON.stringify(updatedMethods));
    addNotification({
      type: 'success',
      message: 'Méthode de retrait supprimée'
    });
  };

  const handleSetDefault = (id: string) => {
    const updatedMethods = methods.map(m => ({
      ...m,
      isDefault: m.id === id
    }));
    setMethods(updatedMethods);
    localStorage.setItem('withdraw_methods', JSON.stringify(updatedMethods));
    addNotification({
      type: 'success',
      message: 'Méthode de retrait par défaut mise à jour'
    });
  };

  return (
    <div className="space-y-4">
      {methods.map((method) => (
        <WithdrawMethodCard
          key={method.id}
          method={method}
          onDelete={handleDelete}
          onSetDefault={handleSetDefault}
        />
      ))}

      {!showAddForm ? (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full p-4 border-2 border-dashed border-gray-200 rounded-lg text-center hover:border-purple-200 hover:bg-purple-50"
        >
          <Plus className="h-6 w-6 mx-auto text-gray-400" />
          <span className="mt-2 block text-sm text-gray-600">
            Ajouter une méthode de retrait
          </span>
        </button>
      ) : (
        <WithdrawMethodForm
          onSave={handleAddMethod}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
}