import { create } from 'zustand';
import { Cupcake } from '../types';

interface FavoritesStore {
  favorites: Cupcake[];
  toggleFavorite: (cupcake: Cupcake) => void;
}

export const useFavoritesStore = create<FavoritesStore>((set) => ({
  favorites: [],
  toggleFavorite: (cupcake) =>
    set((state) => {
      const isFavorite = state.favorites.some((fav) => fav.id === cupcake.id);
      if (isFavorite) {
        return {
          favorites: state.favorites.filter((fav) => fav.id !== cupcake.id),
        };
      }
      return { favorites: [...state.favorites, cupcake] };
    }),
}));