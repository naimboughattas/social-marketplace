import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import Button from './Button';
import AccountCard from './AccountCard';
import AccountSettingsModal from './AccountSettingsModal';
import { SocialAccount } from '../lib/types';

interface MyAccountsProps {
  accounts: SocialAccount[];
  onAddAccount: (account: SocialAccount) => void;
  onUpdateAccount: (id: string, updates: Partial<SocialAccount>) => void;
  onDeleteAccount: (id: string) => void;
}

export default function MyAccounts({ 
  accounts, 
  onAddAccount, 
  onUpdateAccount,
  onDeleteAccount 
}: MyAccountsProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState('');

  const filteredAccounts = accounts.filter(account => 
    account.username.toLowerCase().includes(search.toLowerCase()) ||
    account.displayName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mes comptes</h2>
          <p className="mt-1 text-sm text-gray-500">
            Gérez vos comptes sociaux et leurs paramètres
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un compte..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un compte
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAccounts.map((account) => (
          <AccountCard
            key={account.id}
            account={account}
            onUpdate={(updates) => onUpdateAccount(account.id, updates)}
            onDelete={() => onDeleteAccount(account.id)}
          />
        ))}
        
        {filteredAccounts.length === 0 && (
          <div className="col-span-3 py-12 text-center text-gray-500">
            Aucun compte trouvé
          </div>
        )}
      </div>

      {showAddModal && (
        <AccountSettingsModal
          onClose={() => setShowAddModal(false)}
          onSave={onAddAccount}
        />
      )}
    </div>
  );
}