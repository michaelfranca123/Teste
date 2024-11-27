import React, { useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { X } from 'lucide-react';
import CheckoutModal from './CheckoutModal';
import AuthModal from './AuthModal';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { items, removeFromCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  if (!isOpen) return null;

  const total = items.reduce(
    (sum, item) => sum + item.cupcake.preco * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (isAuthenticated) {
      setIsCheckoutOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#011206]">Carrinho</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X />
            </button>
          </div>

          {items.length === 0 ? (
            <p className="text-center text-gray-500">Seu carrinho está vazio</p>
          ) : (
            <>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item.cupcake.id}
                    className="flex items-center justify-between border-b pb-4"
                  >
                    <div className="flex items-center">
                      <img
                        src={item.cupcake.imagem}
                        alt={item.cupcake.nome}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="ml-4">
                        <h3 className="font-semibold">{item.cupcake.nome}</h3>
                        <p className="text-gray-500">
                          Quantidade: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="font-bold mr-4">
                        R$ {(item.cupcake.preco * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.cupcake.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold text-xl">
                    R$ {total.toFixed(2)}
                  </span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-[#110121] text-white py-3 rounded-lg hover:bg-[#011206] transition-colors"
                >
                  {isAuthenticated ? 'Finalizar Compra' : 'Entrar para Finalizar Compra'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        preserveCart={true}
      />
      
      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        total={total}
      />
    </>
  );
};

export default CartModal;