import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import Button from '../Button';
import Input from '../Input';
import * as Dialog from '@radix-ui/react-dialog';

interface InvoiceFilters {
  startDate: string;
  endDate: string;
  minAmount: string;
  maxAmount: string;
  paymentMethod: string;
}

interface InvoiceFiltersProps {
  filters: InvoiceFilters;
  onFiltersChange: (filters: InvoiceFilters) => void;
  onReset: () => void;
}

export default function InvoiceFilters({
  filters,
  onFiltersChange,
  onReset
}: InvoiceFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="flex items-center space-x-4">
      <div className="relative w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Rechercher une facture..."
          className="pl-10"
        />
      </div>

      <Button
        variant="outline"
        onClick={() => setShowFilters(true)}
      >
        <Filter className="h-4 w-4 mr-2" />
        Filtres avancés
      </Button>

      <Dialog.Root open={showFilters} onOpenChange={setShowFilters}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title className="text-lg font-medium">
                Filtres avancés
              </Dialog.Title>
              <button onClick={() => setShowFilters(false)}>
                <X className="h-6 w-6 text-gray-400" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Date range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de début
                  </label>
                  <Input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => onFiltersChange({
                      ...filters,
                      startDate: e.target.value
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de fin
                  </label>
                  <Input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => onFiltersChange({
                      ...filters,
                      endDate: e.target.value
                    })}
                  />
                </div>
              </div>

              {/* Amount range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Montant minimum
                  </label>
                  <Input
                    type="number"
                    value={filters.minAmount}
                    onChange={(e) => onFiltersChange({
                      ...filters,
                      minAmount: e.target.value
                    })}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Montant maximum
                  </label>
                  <Input
                    type="number"
                    value={filters.maxAmount}
                    onChange={(e) => onFiltersChange({
                      ...filters,
                      maxAmount: e.target.value
                    })}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Payment method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Moyen de paiement
                </label>
                <select
                  value={filters.paymentMethod}
                  onChange={(e) => onFiltersChange({
                    ...filters,
                    paymentMethod: e.target.value
                  })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                >
                  <option value="">Tous les moyens de paiement</option>
                  <option value="card">Carte bancaire</option>
                  <option value="bank">Virement bancaire</option>
                  <option value="paypal">PayPal</option>
                  <option value="gains">Transfert des gains</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    onReset();
                    setShowFilters(false);
                  }}
                >
                  Réinitialiser
                </Button>
                <Button onClick={() => setShowFilters(false)}>
                  Appliquer
                </Button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}