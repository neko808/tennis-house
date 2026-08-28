"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import {
  addToCartAction,
  getCartAction,
  removeLineItemAction,
  updateLineItemAction,
} from "@/app/actions/cart";
import type { Cart } from "@/types/medusa";

interface CartContextValue {
  cart: Cart | null;
  itemCount: number;
  /** True until the first server fetch resolves. */
  loading: boolean;
  isOpen: boolean;
  pending: boolean;
  error: string | null;
  openCart: () => void;
  closeCart: () => void;
  addItem: (productId: string, variantId: string, quantity: number) => Promise<boolean>;
  updateItem: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;
    getCartAction().then(({ cart }) => {
      if (cancelled) return;
      setCart(cart);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback(
    async (productId: string, variantId: string, quantity: number) => {
      const result = await addToCartAction(productId, variantId, quantity);
      setCart(result.cart);
      setError(result.error ?? null);
      if (!result.error) setIsOpen(true);
      return !result.error;
    },
    [],
  );

  const updateItem = useCallback((variantId: string, quantity: number) => {
    startTransition(async () => {
      const result = await updateLineItemAction(variantId, quantity);
      setCart(result.cart);
      setError(result.error ?? null);
    });
  }, []);

  const removeItem = useCallback((variantId: string) => {
    startTransition(async () => {
      const result = await removeLineItemAction(variantId);
      setCart(result.cart);
      setError(result.error ?? null);
    });
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount: cart?.item_count ?? 0,
        loading,
        isOpen,
        pending,
        error,
        openCart,
        closeCart,
        addItem,
        updateItem,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>.");
  return ctx;
}
