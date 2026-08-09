"use client";
import { createContext, useCallback, useContext, useState } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
};

type CartContextValue = {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (item: CartItem) => void;
};

const CartContext = createContext<CartContextValue>({
  cartItems: [],
  cartCount: 0,
  addToCart: () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((item: CartItem) => {
    setCartItems((prev) => [...prev, item]);
  }, []);

  return (
    <CartContext.Provider
      value={{ cartItems, cartCount: cartItems.length, addToCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
