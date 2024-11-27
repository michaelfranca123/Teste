import React, { useState, useMemo } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Banner from './components/Banner';
import ProductCard from './components/ProductCard';
import CategoryBar from './components/CategoryBar';
import CustomCupcakeBuilder from './components/CustomCupcakeBuilder';
import { cupcakes } from './data/cupcakes';
import { useFavoritesStore } from './store/favoritesStore';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const favorites = useFavoritesStore((state) => state.favorites);

  const filteredCupcakes = useMemo(() => {
    let filtered = cupcakes;

    if (searchQuery) {
      filtered = cupcakes.filter((cupcake) =>
        cupcake.nome.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else if (selectedCategory === 'Favoritos') {
      filtered = favorites;
    } else if (selectedCategory === 'Todos') {
      filtered = showAll ? cupcakes : getHighlightedCupcakes();
    } else if (selectedCategory !== 'Personalizado') {
      filtered = cupcakes.filter((cupcake) => cupcake.categoria === selectedCategory);
    }

    return filtered;
  }, [selectedCategory, showAll, searchQuery, favorites]);

  function getHighlightedCupcakes() {
    const categories = ['Tradicionais', 'Frutas', 'Premium'];
    return categories.map(category => 
      cupcakes.find(cupcake => cupcake.categoria === category)
    ).filter(Boolean);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Navbar 
        onSearch={setSearchQuery} 
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <Banner />
      <CategoryBar 
        selectedCategory={selectedCategory}
        onSelectCategory={(category) => {
          setSelectedCategory(category);
          setSearchQuery('');
        }}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {selectedCategory === 'Personalizado' ? (
          <CustomCupcakeBuilder />
        ) : (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#011206]">
                {searchQuery
                  ? 'Resultados da Busca'
                  : selectedCategory === 'Favoritos'
                  ? 'Meus Favoritos'
                  : selectedCategory === 'Todos' && !showAll 
                    ? 'Cupcakes em Destaque'
                    : 'Nossos Cupcakes'
                }
              </h1>
              {selectedCategory === 'Todos' && !showAll && !searchQuery && (
                <button 
                  onClick={() => setShowAll(true)}
                  className="text-[#110121] hover:text-[#011206] transition-colors text-sm sm:text-base"
                >
                  Ver todos <span className="ml-2">→</span>
                </button>
              )}
            </div>

            {filteredCupcakes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">
                  {selectedCategory === 'Favoritos'
                    ? 'Você ainda não tem favoritos'
                    : `Nenhum cupcake encontrado ${searchQuery ? `com "${searchQuery}"` : ''} 😢`}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('Todos');
                  }}
                  className="mt-4 text-[#110121] hover:underline"
                >
                  Voltar para todos os cupcakes
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredCupcakes.map((cupcake) => (
                  <ProductCard key={cupcake.id} {...cupcake} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;