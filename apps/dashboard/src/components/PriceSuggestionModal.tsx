import { useState } from 'react';
import { X, Calculator } from 'lucide-react';
import Button from './Button';
import * as Dialog from '@radix-ui/react-dialog';

interface PriceRange {
  min: number;
  max: number;
}

interface PriceBracket {
  followers: {
    min: number;
    max: number | null;
  };
  prices: {
    like: PriceRange;
    comment: PriceRange;
    repost_story: PriceRange;
    follow: PriceRange;
  };
}

const PRICE_BRACKETS: PriceBracket[] = [
  {
    followers: { min: 0, max: 1000 },
    prices: {
      like: { min: 0.05, max: 0.10 },
      comment: { min: 0.10, max: 0.20 },
      repost_story: { min: 1.00, max: 2.00 },
      follow: { min: 0.25, max: 0.50 }
    }
  },
  {
    followers: { min: 1001, max: 10000 },
    prices: {
      like: { min: 0.10, max: 0.20 },
      comment: { min: 0.25, max: 0.50 },
      repost_story: { min: 5.00, max: 10.00 },
      follow: { min: 1.00, max: 2.50 }
    }
  },
  {
    followers: { min: 10001, max: 50000 },
    prices: {
      like: { min: 0.20, max: 0.50 },
      comment: { min: 0.50, max: 1.00 },
      repost_story: { min: 15.00, max: 30.00 },
      follow: { min: 2.50, max: 5.00 }
    }
  },
  {
    followers: { min: 50001, max: 100000 },
    prices: {
      like: { min: 0.30, max: 1.00 },
      comment: { min: 0.75, max: 2.00 },
      repost_story: { min: 30.00, max: 75.00 },
      follow: { min: 5.00, max: 10.00 }
    }
  },
  {
    followers: { min: 100001, max: 500000 },
    prices: {
      like: { min: 0.50, max: 2.00 },
      comment: { min: 1.50, max: 5.00 },
      repost_story: { min: 75.00, max: 150.00 },
      follow: { min: 10.00, max: 20.00 }
    }
  },
  {
    followers: { min: 500001, max: 1000000 },
    prices: {
      like: { min: 1.00, max: 5.00 },
      comment: { min: 3.00, max: 10.00 },
      repost_story: { min: 150.00, max: 300.00 },
      follow: { min: 20.00, max: 50.00 }
    }
  },
  {
    followers: { min: 1000001, max: null },
    prices: {
      like: { min: 2.00, max: 10.00 },
      comment: { min: 5.00, max: 20.00 },
      repost_story: { min: 300.00, max: 1000.00 },
      follow: { min: 50.00, max: 100.00 }
    }
  }
];

interface SuggestedPrices {
  like: number;
  comment: number;
  repost_story: number;
  follow: number;
}

interface PriceSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  followers: number;
  onApply: (prices: SuggestedPrices) => void;
}

export default function PriceSuggestionModal({
  isOpen,
  onClose,
  followers,
  onApply
}: PriceSuggestionModalProps) {
  const [selectedPrices, setSelectedPrices] = useState<SuggestedPrices>(() => {
    const bracket = PRICE_BRACKETS.find(b => 
      followers >= b.followers.min && 
      (b.followers.max === null || followers <= b.followers.max)
    );

    if (!bracket) return { like: 0, comment: 0, repost_story: 0, follow: 0 };

    // Calculer la moyenne de chaque fourchette de prix
    return {
      like: (bracket.prices.like.min + bracket.prices.like.max) / 2,
      comment: (bracket.prices.comment.min + bracket.prices.comment.max) / 2,
      repost_story: (bracket.prices.repost_story.min + bracket.prices.repost_story.max) / 2,
      follow: (bracket.prices.follow.min + bracket.prices.follow.max) / 2
    };
  });

  const bracket = PRICE_BRACKETS.find(b => 
    followers >= b.followers.min && 
    (b.followers.max === null || followers <= b.followers.max)
  );

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-lg">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-lg font-medium">
              Suggestion de prix
            </Dialog.Title>
            <button onClick={onClose}>
              <X className="h-6 w-6 text-gray-400" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-700">
                Basé sur votre nombre de followers ({followers.toLocaleString()}), 
                voici les prix suggérés pour vos services. Vous pouvez les ajuster 
                avant de les appliquer.
              </p>
            </div>

            {bracket && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prix par like
                    </label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={selectedPrices.like}
                        onChange={(e) => setSelectedPrices({
                          ...selectedPrices,
                          like: parseFloat(e.target.value)
                        })}
                        className="w-full p-2 border rounded-l"
                        min={bracket.prices.like.min}
                        max={bracket.prices.like.max}
                        step="0.1"
                      />
                      <span className="px-3 py-2 bg-gray-100 border border-l-0 rounded-r">
                        €
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Fourchette conseillée : {bracket.prices.like.min}€ - {bracket.prices.like.max}€
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prix par commentaire
                    </label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={selectedPrices.comment}
                        onChange={(e) => setSelectedPrices({
                          ...selectedPrices,
                          comment: parseFloat(e.target.value)
                        })}
                        className="w-full p-2 border rounded-l"
                        min={bracket.prices.comment.min}
                        max={bracket.prices.comment.max}
                        step="0.1"
                      />
                      <span className="px-3 py-2 bg-gray-100 border border-l-0 rounded-r">
                        €
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Fourchette conseillée : {bracket.prices.comment.min}€ - {bracket.prices.comment.max}€
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prix par story
                    </label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={selectedPrices.repost_story}
                        onChange={(e) => setSelectedPrices({
                          ...selectedPrices,
                          repost_story: parseFloat(e.target.value)
                        })}
                        className="w-full p-2 border rounded-l"
                        min={bracket.prices.repost_story.min}
                        max={bracket.prices.repost_story.max}
                        step="0.1"
                      />
                      <span className="px-3 py-2 bg-gray-100 border border-l-0 rounded-r">
                        €
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Fourchette conseillée : {bracket.prices.repost_story.min}€ - {bracket.prices.repost_story.max}€
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prix par follow
                    </label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={selectedPrices.follow}
                        onChange={(e) => setSelectedPrices({
                          ...selectedPrices,
                          follow: parseFloat(e.target.value)
                        })}
                        className="w-full p-2 border rounded-l"
                        min={bracket.prices.follow.min}
                        max={bracket.prices.follow.max}
                        step="0.1"
                      />
                      <span className="px-3 py-2 bg-gray-100 border border-l-0 rounded-r">
                        €
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Fourchette conseillée : {bracket.prices.follow.min}€ - {bracket.prices.follow.max}€
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <Button variant="outline" onClick={onClose}>
                    Annuler
                  </Button>
                  <Button onClick={() => {
                    onApply(selectedPrices);
                    onClose();
                  }}>
                    Appliquer ces prix
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}