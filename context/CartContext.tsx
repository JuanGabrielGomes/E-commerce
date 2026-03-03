"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/types/product";

type CartItem = Product & {
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
};

const STORAGE_KEY = "ecommerce_cart_v1";

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;

      const validItems = parsed.filter((item: unknown): item is CartItem => {
        if (typeof item !== "object" || item === null) return false;
        const candidate = item as Partial<CartItem>;
        return typeof candidate.id_produto === "number" && typeof candidate.quantity === "number";
      });

      setItems(validItems);
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product: Product) => {
    setItems((currentItems) => {
      const existing = currentItems.find((item) => item.id_produto === product.id_produto);
      if (existing) {
        return currentItems.map((item) =>
          item.id_produto === product.id_produto ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...currentItems, { ...product, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((productId: number) => {
    setItems((currentItems) => currentItems.filter((item) => item.id_produto !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      setItems((currentItems) => currentItems.filter((item) => item.id_produto !== productId));
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) => (item.id_produto === productId ? { ...item, quantity } : item))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = useMemo(
    () => items.reduce((accumulator, item) => accumulator + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () =>
      items.reduce((accumulator, item) => {
        const effectivePrice = item.desconto ? item.preco - item.desconto : item.preco;
        return accumulator + effectivePrice * item.quantity;
      }, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      totalItems,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart
    }),
    [items, totalItems, subtotal, addItem, removeItem, updateQuantity, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart precisa ser usado dentro do CartProvider.");
  }

  return context;
}

