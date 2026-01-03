import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartProduct } from "~/types/product";

interface WishlistStore {
  items: CartProduct[];
  addItem: (product: CartProduct) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleItem: (product: CartProduct) => void;
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product) => {
        set((state) => {
          if (state.items.some((item) => item.id === product.id)) {
            return state;
          }
          return {
            items: [...state.items, product],
          };
        });
      },
      
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },
      
      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId);
      },
      
      toggleItem: (product) => {
        const isInList = get().isInWishlist(product.id);
        if (isInList) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },
    }),
    {
      name: "lumiere-wishlist-storage",
    }
  )
);
