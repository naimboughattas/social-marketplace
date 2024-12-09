import { CartItem } from "../cart";

export interface Cart {
  items: CartItem[];
  total: number;
}