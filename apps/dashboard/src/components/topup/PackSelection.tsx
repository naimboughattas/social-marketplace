import { cn } from '../../lib/utils';
import Button from '../Button';

interface Pack {
  id: number;
  amount: number;
  bonus: number;
  popular?: boolean;
}

interface PackSelectionProps {
  packs: Pack[];
  selectedPack: number | null;
  onPackSelect: (packId: number) => void;
}

export default function PackSelection({ packs, selectedPack, onPackSelect }: PackSelectionProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {packs.map((pack) => {
        const tva = pack.amount * 0.20;
        const ttc = pack.amount + tva;
        
        return (
          <div
            key={pack.id}
            className={cn(
              "relative rounded-lg border-2 p-6 transition-all duration-200",
              selectedPack === pack.id
                ? 'border-purple-600 bg-purple-50 shadow-lg scale-105'
                : 'border-gray-200 bg-white hover:border-purple-200 hover:shadow'
            )}
          >
            {pack.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                  Populaire
                </span>
              </div>
            )}
            <div className="text-center">
              <div className="flex items-baseline justify-center space-x-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  {pack.amount} €
                </h3>
                <span className="text-sm text-gray-500">HT</span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {ttc.toFixed(2)} € TTC
              </p>
              {pack.bonus > 0 && (
                <p className="mt-2 text-sm font-medium text-green-600 bg-green-50 py-1 px-2 rounded-full inline-block">
                  +{pack.bonus} € offerts
                </p>
              )}
              <Button
                className="mt-6 w-full py-3 text-base font-medium transition-transform active:scale-95"
                variant={selectedPack === pack.id ? 'primary' : 'outline'}
                onClick={() => onPackSelect(pack.id)}
              >
                Sélectionner
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}