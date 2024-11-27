import React, { useState } from 'react';
import { Heart, Star, Minus, Plus } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useFavoritesStore } from '../store/favoritesStore';
import { Cupcake } from '../types';
import toast from 'react-hot-toast';

interface ProductCardProps extends Cupcake {}

const ProductCard = (props: ProductCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const addToCart = useCartStore((state) => state.addToCart);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const favorites = useFavoritesStore((state) => state.favorites);

  const isFavorite = favorites.some((fav) => fav.id === props.id);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(props);
    }
    toast.success(`${quantity} ${quantity === 1 ? 'Cupcake adicionado' : 'Cupcakes adicionados'} ao carrinho!`);
    setQuantity(1);
  };

  const handleToggleFavorite = () => {
    toggleFavorite(props);
    toast.success(isFavorite ? 'Removido dos favoritos!' : 'Adicionado aos favoritos!');
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img 
          src={props.imagem} 
          alt={props.nome} 
          className="w-full h-48 sm:h-56 object-cover"
        />
        <button
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
        >
          <Heart
            className={`h-5 w-5 ${
              isFavorite ? 'text-red-500 fill-current' : 'text-[#110121]'
            }`}
          />
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-[#011206] mb-2">{props.nome}</h3>
        <p className="text-gray-600 text-sm mb-3">{props.descricao}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">{props.avaliacao}</span>
          </div>
          <div className="flex items-center">
            <span className="text-lg font-bold text-[#011206]">
              R$ {props.preco.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-600">Quantidade:</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={decrementQuantity}
              className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Minus className="h-4 w-4 text-[#110121]" />
            </button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <button
              onClick={incrementQuantity}
              className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Plus className="h-4 w-4 text-[#110121]" />
            </button>
          </div>
        </div>
        
        <button
          onClick={handleAddToCart}
          className="w-full bg-[#110121] text-white py-2 rounded-lg hover:bg-[#011206] transition-colors"
        >
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
};

export default ProductCard;