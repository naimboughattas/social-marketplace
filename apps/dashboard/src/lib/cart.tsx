import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Service } from "./types";
import { useNotifications } from "./notifications";

export interface CartItem {
  id: string;
  influencerUsername: string;
  service: Service;
  price: number;
  targetHandle: string;
  postUrl?: string;
  commentText?: string;
  isRecurring?: boolean;
  isFuturePosts?: boolean;
  isCampaign?: boolean;
  campaignSettings?: {
    category: string;
    country: string;
    city: string;
    language: string;
    quantity: number;
  };
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
}

const CartContext = createContext<CartContextType | null>(null);

// Fonction pour calculer le prix d'un article
function calculateItemPrice(item: CartItem): number {
  // Pour les campagnes, le prix est calculé différemment
  if (item.isCampaign) {
    return item.price * (item.campaignSettings?.quantity || 1);
  }

  // Pour les futurs posts uniquement (abonnement), le prix est 0
  if (item.isFuturePosts && !item.postUrl) {
    return 0; // Abonnement uniquement, pas de coût initial
  }

  // Pour follow, prix standard
  if (item.service === "follow") {
    return item.price;
  }

  // Pour les posts spécifiques ou posts spécifiques + futurs posts
  const postUrls =
    item.postUrl?.split("|").filter((url) => url.trim() !== "") || [];
  return item.price * Math.max(1, postUrls.length);
}

// Fonction pour récupérer les données du panier depuis localStorage
const getCartFromLocalStorage = (): CartState => {
  const storedCart = localStorage.getItem("cart");
  if (storedCart) {
    return JSON.parse(storedCart);
  }
  return { items: [], total: 0 };
};

// Fonction pour sauvegarder le panier dans localStorage
const saveCartToLocalStorage = (cart: CartState) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

export function CartProvider({ children }: { children: ReactNode }) {
  const { addNotification } = useNotifications();

  // Initialisation de l'état avec les données du localStorage
  const [state, setState] = useState<CartState>(() =>
    getCartFromLocalStorage()
  );

  // Fonction pour ajouter un article au panier
  const addItem = (item: CartItem, silent = false) => {
    const itemPrice = calculateItemPrice(item);
    setState((prevState) => {
      const updatedCart = {
        items: [...prevState.items, item],
        total: prevState.total + itemPrice,
      };
      // Sauvegarder le panier dans localStorage
      saveCartToLocalStorage(updatedCart);
      return updatedCart;
    });

    if (!silent) {
      addNotification({
        type: "success",
        message: "Service ajouté au panier",
      });
    }
  };

  // Fonction pour supprimer un article du panier
  const removeItem = (id: string) => {
    setState((prevState) => {
      const item = prevState.items.find((i) => i.id === id);
      if (!item) return prevState;

      const itemPrice = calculateItemPrice(item);
      const updatedCart = {
        items: prevState.items.filter((i) => i.id !== id),
        total: prevState.total - itemPrice,
      };
      // Sauvegarder le panier dans localStorage
      saveCartToLocalStorage(updatedCart);
      return updatedCart;
    });
  };

  // Fonction pour vider le panier
  const clearCart = () => {
    setState({
      items: [],
      total: 0,
    });
    // Sauvegarder un panier vide dans localStorage
    saveCartToLocalStorage({
      items: [],
      total: 0,
    });
  };

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

// Hook pour accéder au panier
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
