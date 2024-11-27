import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface OrderNumberContextType {
  getNextOrderNumber: () => number;
  getCurrentOrderNumber: () => number;
}

const OrderNumberContext = createContext<OrderNumberContextType | null>(null);

export function OrderNumberProvider({ children }: { children: ReactNode }) {
  const [lastOrderNumber, setLastOrderNumber] = useState(() => {
    const saved = localStorage.getItem('lastOrderNumber');
    return saved ? parseInt(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem('lastOrderNumber', lastOrderNumber.toString());
  }, [lastOrderNumber]);

  const getNextOrderNumber = () => {
    const nextNumber = lastOrderNumber + 1;
    setLastOrderNumber(nextNumber);
    return nextNumber;
  };

  const getCurrentOrderNumber = () => {
    return lastOrderNumber;
  };

  return (
    <OrderNumberContext.Provider value={{ getNextOrderNumber, getCurrentOrderNumber }}>
      {children}
    </OrderNumberContext.Provider>
  );
}

export function useOrderNumber() {
  const context = useContext(OrderNumberContext);
  if (!context) {
    throw new Error('useOrderNumber must be used within an OrderNumberProvider');
  }
  return context;
}