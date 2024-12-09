import { useState, useEffect } from 'react';
import { Platform, SocialAccount } from '../lib/types';
import { getInfluencers } from '../lib/firebase/influencers';
import { useNotifications } from '../lib/notifications';
import { is } from 'date-fns/locale';

interface Filters {
  category: string;
  language: string;
  country: string;
  minFollowers: string;
  maxFollowers: string;
  minPrice: string;
  maxPrice: string;
}

const defaultFilters: Filters = {
  category: '',
  language: '',
  country: '',
  minFollowers: '',
  maxFollowers: '',
  minPrice: '',
  maxPrice: ''
};

export function useInfluencerFilters(
  initialInfluencers: SocialAccount[],
  platform: Platform,
  search: string
) {
  const { addNotification } = useNotifications();
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [filteredInfluencers, setFilteredInfluencers] = useState<SocialAccount[]>(initialInfluencers);
  const [loading, setLoading] = useState(false);

  const resetFilters = () => setFilters(defaultFilters);

  useEffect(() => {
    const applyFilters = async () => {
      try {
        setLoading(true);
        
        // Construct filter object for Firebase query
        const filterParams: any = {
          platform,
          ...(filters.category && { category: filters.category }),
          ...(filters.language && { language: filters.language }),
          ...(filters.country && { country: filters.country }),
          ...(filters.minFollowers && { minFollowers: parseInt(filters.minFollowers) }),
          ...(filters.maxFollowers && { maxFollowers: parseInt(filters.maxFollowers) }),
          isVerified: true
          
        };

        // Get filtered influencers from Firebase
        const results = await getInfluencers(filterParams);

        // Apply client-side filters that can't be done in Firebase
        let filtered = results;

        // Apply search filter
        if (search) {
          filtered = filtered.filter(inf =>
            inf.username.toLowerCase().includes(search.toLowerCase()) ||
            inf.displayName.toLowerCase().includes(search.toLowerCase())
          );
        }

        // Apply price filters
        if (filters.minPrice || filters.maxPrice) {
          filtered = filtered.filter(inf => {
            const prices = Object.values(inf.prices).filter(p => p !== undefined);
            if (prices.length === 0) return false;
            
            const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
            
            if (filters.minPrice && avgPrice < parseFloat(filters.minPrice)) return false;
            if (filters.maxPrice && avgPrice > parseFloat(filters.maxPrice)) return false;
            
            return true;
          });
        }

        setFilteredInfluencers(filtered);
      } catch (error) {
        addNotification({
          type: 'error',
          message: 'Erreur lors de l\'application des filtres'
        });
      } finally {
        setLoading(false);
      }
    };

    applyFilters();
  }, [platform, filters, search, initialInfluencers]);

  return {
    filters,
    setFilters,
    resetFilters,
    filteredInfluencers,
    loading
  };
}