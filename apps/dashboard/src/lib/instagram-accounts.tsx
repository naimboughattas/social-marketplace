import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SocialAccount } from './types';

interface InstagramAccountsContextType {
  accounts: SocialAccount[];
  addAccount: (account: SocialAccount) => void;
  updateAccount: (id: string, updates: Partial<SocialAccount>) => void;
  removeAccount: (id: string) => void;
  getAccount: (id: string) => SocialAccount | undefined;
}

const InstagramAccountsContext = createContext<InstagramAccountsContextType | null>(null);

export function InstagramAccountsProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<SocialAccount[]>(() => {
    const saved = localStorage.getItem('instagram_accounts');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist accounts to localStorage
  useEffect(() => {
    localStorage.setItem('instagram_accounts', JSON.stringify(accounts));
  }, [accounts]);

  const addAccount = (account: SocialAccount) => {
    setAccounts(prev => [...prev, account]);
  };

  const updateAccount = (id: string, updates: Partial<SocialAccount>) => {
    setAccounts(prev => prev.map(account => 
      account.id === id ? { ...account, ...updates } : account
    ));
  };

  const removeAccount = (id: string) => {
    setAccounts(prev => prev.filter(account => account.id !== id));
  };

  const getAccount = (id: string) => {
    return accounts.find(account => account.id === id);
  };

  return (
    <InstagramAccountsContext.Provider value={{
      accounts,
      addAccount,
      updateAccount,
      removeAccount,
      getAccount
    }}>
      {children}
    </InstagramAccountsContext.Provider>
  );
}

export function useInstagramAccounts() {
  const context = useContext(InstagramAccountsContext);
  if (!context) {
    throw new Error('useInstagramAccounts must be used within an InstagramAccountsProvider');
  }
  return context;
}