import { useState } from 'react';
import { Service, SocialAccount } from '../../../lib/types';
import { useCart } from '../../../lib/cart';
import { useNotifications } from '../../../lib/notifications';

export function useMultiSelect() {
  const { addItem } = useCart();
  const { addNotification } = useNotifications();
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [selectedInfluencers, setSelectedInfluencers] = useState<string[]>([]);
  const [currentMultiSelectService, setCurrentMultiSelectService] = useState<{
    service: Service;
    target: string;
    commentText?: string;
  } | null>(null);

  const handleMultiSelectConfirm = (service: Service, target: string, commentText?: string) => {
    setMultiSelectMode(true);
    setSelectedInfluencers([]);
    setCurrentMultiSelectService({ service, target, commentText });
    addNotification({
      type: 'info',
      message: 'Sélectionnez maintenant les influenceurs pour cette action'
    });
  };

  const handleConfirmSelection = (influencers: SocialAccount[]) => {
    if (!currentMultiSelectService) return;

    const selectedAccounts = influencers.filter(inf => 
      selectedInfluencers.includes(inf.id)
    );

    selectedAccounts.forEach(influencer => {
      addItem({
        id: crypto.randomUUID(),
        influencerUsername: influencer.username,
        service: currentMultiSelectService.service,
        price: influencer.prices[currentMultiSelectService.service] || 0,
        targetHandle: currentMultiSelectService.target,
        commentText: currentMultiSelectService.commentText
      });
    });

    addNotification({
      type: 'success',
      message: `${selectedAccounts.length} service(s) ajouté(s) au panier`
    });

    resetMultiSelect();
  };

  const resetMultiSelect = () => {
    setMultiSelectMode(false);
    setSelectedInfluencers([]);
    setCurrentMultiSelectService(null);
  };

  return {
    multiSelectMode,
    selectedInfluencers,
    handleMultiSelectConfirm,
    handleConfirmSelection,
    resetMultiSelect,
    setSelectedInfluencers
  };
}