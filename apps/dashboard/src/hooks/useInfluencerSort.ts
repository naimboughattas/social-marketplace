import { useState } from 'react';
import { SocialAccount } from '../lib/types';

type SortField = 'followers' | 'delai' | 'follow' | 'like' | 'comment' | 'repost';
type SortDirection = 'asc' | 'desc';

export function useInfluencerSort(influencers: SocialAccount[]) {
  const [sortField, setSortField] = useState<SortField>('followers');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedInfluencers = [...influencers].sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    
    switch (sortField) {
      case 'followers':
        return (a.followers - b.followers) * direction;
      case 'delai':
        return (a.avgDeliveryTime - b.avgDeliveryTime) * direction;
      case 'follow':
        return ((a.prices.follow || 0) - (b.prices.follow || 0)) * direction;
      case 'like':
        return ((a.prices.like || 0) - (b.prices.like || 0)) * direction;
      case 'comment':
        return ((a.prices.comment || 0) - (b.prices.comment || 0)) * direction;
      case 'repost':
        return ((a.prices.repost_story || 0) - (b.prices.repost_story || 0)) * direction;
      default:
        return 0;
    }
  });

  return {
    sortField,
    sortDirection,
    sortedInfluencers,
    handleSort
  };
}