import { create } from 'zustand';
import { Cupcake } from '../types';

interface CartStore {
  items: { cupcake: Cupcake; quantity: number }[];
  addToCart: (cupcake: Cupcake) => void;
  removeFromCart: (cupcakeId: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  addToCart: (cupcake) =>
    set((state) => {
      const existingItem = state.items.find((item) => item.cupcake.id === cupcake.id);
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.cupcake.id === cupcake.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return { items: [...state.items, { cupcake, quantity: 1 }] };
    }),
  removeFromCart: (cupcakeId) =>
    set((state) => ({
      items: state.items.filter((item) => item.cupcake.id !== cupcakeId),
    })),
  clearCart: () => set({ items: [] }),
}));