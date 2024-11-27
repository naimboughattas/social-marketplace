import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SocialAccount } from './types';

interface FavoritesContextType {
  favorites: SocialAccount[];
  addFavorite: (account: SocialAccount) => void;
  removeFavorite: (accountId: string) => void;
  isFavorite: (accountId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<SocialAccount[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (account: SocialAccount) => {
    setFavorites(prev => [...prev, account]);
  };

  const removeFavorite = (accountId: string) => {
    setFavorites(prev => prev.filter(account => account.id !== accountId));
  };

  const isFavorite = (accountId: string) => {
    return favorites.some(account => account.id === accountId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}