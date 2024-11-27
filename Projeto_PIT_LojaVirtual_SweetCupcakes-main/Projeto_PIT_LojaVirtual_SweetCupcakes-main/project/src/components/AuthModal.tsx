import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  preserveCart?: boolean;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, preserveCart = false }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: ''
  });

  const { login, register } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.senha || (!isLogin && !formData.nome)) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    if (isLogin) {
      const success = await login(formData.email, formData.senha);
      if (success) {
        if (onSuccess) {
          onSuccess();
        } else {
          onClose();
        }
      }
    } else {
      const success = await register(formData.nome, formData.email, formData.senha);
      if (success) {
        setIsLogin(true);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-[#011206]">
          {isLogin ? 'Login' : 'Cadastro'}
        </h2>

        {preserveCart && cartItems.length > 0 && (
          <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              Seus itens do carrinho serão mantidos após o {isLogin ? 'login' : 'cadastro'}.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                Nome
              </label>
              <input
                type="text"
                id="nome"
                placeholder="Seu nome completo"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#110121] focus:border-transparent"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="seu@email.com"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#110121] focus:border-transparent"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              id="senha"
              placeholder="••••••••"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#110121] focus:border-transparent"
              value={formData.senha}
              onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#110121] text-white py-3 rounded-lg hover:bg-[#011206] transition-colors"
          >
            {isLogin ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            className="text-[#110121] hover:underline text-sm"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin 
              ? 'Ainda não tem uma conta? Cadastre-se' 
              : 'Já tem uma conta? Faça login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;