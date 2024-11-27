import { createContext, useContext, useReducer, ReactNode } from 'react';
import { collection, addDoc, writeBatch, doc } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './auth';
import { useNotifications } from './notifications';

export interface CartItem {
  id: string;
  influencerUsername: string;
  service: 'follow' | 'like' | 'comment' | 'repost_story';
  price: number;
  targetHandle?: string;
  postUrl?: string;
  commentText?: string;
  isRecurring?: boolean;
  isFuturePosts?: boolean;
}

interface CartState {
  items: CartItem[];
  total: number;
}

interface CartContextType {
  state: CartState;
  addItem: (item: CartItem, silent?: boolean) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  checkout: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_CART' };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM':
      return {
        items: [...state.items, action.payload],
        total: state.total + action.payload.price
      };
    case 'REMOVE_ITEM':
      const item = state.items.find(i => i.id === action.payload);
      return {
        items: state.items.filter(i => i.id !== action.payload),
        total: state.total - (item?.price || 0)
      };
    case 'CLEAR_CART':
      return {
        items: [],
        total: 0
      };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { addNotification } = useNotifications();
  const { user } = useAuth();
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0
  });

  const addItem = (item: CartItem, silent = false) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
    if (!silent) {
      addNotification({
        type: 'success',
        message: `Service ajouté au panier : ${item.service} par ${item.influencerUsername}`
      });
    }
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const checkout = async () => {
    if (!user) throw new Error('Not authenticated');

    try {
      const batch = writeBatch(db);
      const ordersRef = collection(db, 'orders');

      state.items.forEach(item => {
        const orderRef = doc(ordersRef);
        batch.set(orderRef, {
          userId: user.id,
          influencerUsername: item.influencerUsername,
          service: item.service,
          price: item.price,
          target: item.targetHandle || item.postUrl,
          commentText: item.commentText,
          isRecurring: item.isRecurring,
          isFuturePosts: item.isFuturePosts,
          status: 'pending',
          createdAt: new Date()
        });
      });

      await batch.commit();
      clearCart();
      
      addNotification({
        type: 'success',
        message: 'Commande effectuée avec succès'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Erreur lors de la commande'
      });
      throw error;
    }
  };

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, clearCart, checkout }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}