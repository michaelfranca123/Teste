import React, { useState } from 'react';
import { ShoppingCart, Search, Menu, User, X, Home, Heart, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useFavoritesStore } from '../store/favoritesStore';
import AuthModal from './AuthModal';
import CartModal from './CartModal';

interface NavbarProps {
  onSearch: (query: string) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const categories = [
  "Todos",
  "Tradicionais",
  "Frutas",
  "Premium",
  "Personalizado"
];

const Navbar: React.FC<NavbarProps> = ({ onSearch, selectedCategory, onSelectCategory }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { isAuthenticated, user, logout } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);
  const favorites = useFavoritesStore((state) => state.favorites);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    setIsMobileMenuOpen(false);
  };

  const handleHomeClick = () => {
    onSearch('');
    setSearchQuery('');
    onSelectCategory('Todos');
    setIsMobileMenuOpen(false);
    setIsMenuOpen(false);
  };

  const handleCategoryClick = (category: string) => {
    onSelectCategory(category);
    setIsMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-[#011206] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Menu Button */}
            <div className="flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="sm:hidden mr-4"
              >
                <Menu className="h-6 w-6" />
              </button>
              <button
                onClick={handleHomeClick}
                className="flex items-center space-x-2 hover:text-[#110121] transition-colors"
              >
                <Home className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-xl sm:text-2xl font-bold">Sweet Cupcake</span>
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center space-x-6">
              {/* Categories Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-1 hover:text-[#110121] transition-colors"
                >
                  <span>Categorias</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {isMenuOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryClick(category)}
                        className={`w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 ${
                          selectedCategory === category ? 'bg-gray-100' : ''
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                    <div className="border-t my-2"></div>
                    <button
                      onClick={() => {
                        handleCategoryClick('Favoritos');
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <Heart className="h-4 w-4" />
                      <span>Favoritos ({favorites.length})</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Desktop Search */}
              <div className="flex-1 max-w-xl">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (e.target.value === '') {
                        onSearch('');
                      }
                    }}
                    placeholder="Buscar cupcakes..."
                    className="w-full px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#110121]"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-2.5 text-white/60 hover:text-white"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4 sm:space-x-6">
              {isAuthenticated ? (
                <div className="hidden sm:flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-full">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                    <span className="text-sm">{user?.nome}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="text-sm hover:text-[#110121] transition-colors"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="hidden sm:flex items-center space-x-1 hover:text-[#110121] transition-colors"
                >
                  <User className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="text-sm sm:text-base">Entrar</span>
                </button>
              )}
              <button
                onClick={() => setIsCartModalOpen(true)}
                className="flex items-center space-x-1 hover:text-[#110121] transition-colors"
              >
                <div className="relative">
                  <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#110121] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline text-sm sm:text-base">Carrinho</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`sm:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
            <div className="px-2 pt-2 pb-4 space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value === '') {
                      onSearch('');
                    }
                  }}
                  placeholder="Buscar cupcakes..."
                  className="w-full px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#110121]"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-2.5 text-white/60 hover:text-white"
                >
                  <Search className="h-5 w-5" />
                </button>
              </form>

              {/* Mobile Categories */}
              <div className="space-y-2">
                <p className="px-2 text-sm font-semibold text-white/60">Categorias</p>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className={`block w-full text-left px-2 py-2 rounded-lg ${
                      selectedCategory === category ? 'bg-white/10' : 'hover:bg-white/5'
                    }`}
                  >
                    {category}
                  </button>
                ))}
                <button
                  onClick={() => handleCategoryClick('Favoritos')}
                  className="flex items-center space-x-2 w-full px-2 py-2 rounded-lg hover:bg-white/5"
                >
                  <Heart className="h-4 w-4" />
                  <span>Favoritos ({favorites.length})</span>
                </button>
              </div>

              {/* Mobile Auth */}
              {isAuthenticated ? (
                <div className="px-2 py-2 bg-white/10 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                    <span className="text-sm">{user?.nome}</span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-sm hover:text-[#110121] transition-colors"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 px-2 hover:text-[#110121] transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm">Entrar</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <CartModal isOpen={isCartModalOpen} onClose={() => setIsCartModalOpen(false)} />
    </>
  );
};

export default Navbar;